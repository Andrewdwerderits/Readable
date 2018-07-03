import * as React from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import Card from '@material-ui/core/Card';
import { Row, Col } from 'react-flexbox-grid';
import '../Styles/icon.css';
import '../Styles/text.css';
import ReadableEngine from '../Engines/ReadableEngine';
import { SavePostActionCreator } from '../Actions/SavePost';
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import PostModel from '../Models/PostModel';
import { DeletePostActionCreator } from '../Actions/DeletePost';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import EContentField from '../Enums/EContentField';
import CommentModel from '../Models/CommentModel';
import AppStore from '../Reducers/AppStore';
import Votable from '../Components/Votable';
import TextContent from '../Components/TextContent';
import ContentModel from '../Models/ContentModel';
import { TogglePostDetailsModeActionCreator } from '../Actions/TogglePostDetailsMode';

interface ContentContainerProps extends RouteComponentProps<any> {
    model: CommentModel | PostModel;
}

interface ContentContainerDispatchProps {
    dispatch: any;
}

interface ContentContainerState {
    contentBeforeEdit: CommentModel | PostModel;
    isEditing: boolean;
}

interface ContentContainerStoreProps {
    posts: Array<PostModel>;
    inPostDetailMode: boolean;
}

interface ContentContainerAllProps extends ContentContainerProps, ContentContainerDispatchProps, ContentContainerStoreProps {}

const mapDispatchToProps: MapDispatchToProps<ContentContainerDispatchProps, ContentContainerProps> = (dispatch: any, ownProps: ContentContainerProps): ContentContainerDispatchProps => {
    return {
        dispatch: dispatch,
    }
};

const mapStateToProps: MapStateToProps<ContentContainerStoreProps, ContentContainerProps, AppStore> = (state: AppStore): ContentContainerStoreProps => {
    return {
        posts: state.posts,
        inPostDetailMode: state.inPostDetailMode,
    }
};

class ContentContainer extends React.Component<ContentContainerAllProps, ContentContainerState> {

    public editPost = (event: React.MouseEvent<HTMLElement>) => {
        this.setState((previousState: ContentContainerState) => {
            return {
                ...previousState,
                isEditing: true,
            }
        })
    };

    public doneEditing =() => {
        this.setState((previousState: ContentContainerState) => {
            return {
                ...previousState,
                isEditing: false,
            }
        });
    };

    public delete = (event: React.MouseEvent<HTMLElement>) => {
        let id = this.props.model.id;

        if (!this.props.model.contentModel.existsOnServer) {
            this.props.dispatch(DeletePostActionCreator(id, this.props.model.contentModel.type));
            let postModel = this.props.model as PostModel;
            if (this.props.inPostDetailMode && postModel != null) {
                this.props.dispatch(TogglePostDetailsModeActionCreator(false));
                this.props.history.push(`/${postModel.category.path}`);
            }
        }

        return ReadableEngine.DeletePost(id, this.props.model.contentModel.type)
            .then(() => {
                this.props.dispatch(DeletePostActionCreator(id, this.props.model.contentModel.type));
            })
            .then(() => {
                let postModel = this.props.model as PostModel;
                if (this.props.inPostDetailMode && postModel != null) {
                    this.props.dispatch(TogglePostDetailsModeActionCreator(false));
                    this.props.history.push(`/${postModel.category.path}`);
                }
            });
    };

    public save = (event: React.MouseEvent<HTMLElement>) => {
        ReadableEngine.SaveContentModel(this.props.model.contentModel, this.props.posts)
            .then((updatedModel: PostModel | CommentModel) => {
                this.props.dispatch(SavePostActionCreator(updatedModel));
                return updatedModel;
            })
            .then((model: PostModel | CommentModel) => {
                this.setState((previousState: ContentContainerState) => {

                    let copy = model instanceof PostModel ? PostModel.Copy(model) : CommentModel.Copy(model);

                    return {
                        ...previousState,
                        contentBeforeEdit: copy,
                    }
                });
                this.doneEditing();
            });
    };

    public cancelEdit = (event: React.MouseEvent<HTMLElement>) => {
        let model = this.state.contentBeforeEdit;
        let copy = model instanceof PostModel ? PostModel.Copy(model) : CommentModel.Copy(model);

        this.props.dispatch(SavePostActionCreator(copy));
        this.doneEditing();
    };

    public handleTextChange = (value: string, fieldType: EContentField) => {
        if (fieldType === EContentField.body) {
            this.props.model.contentModel.body = value;
        } else if (fieldType === EContentField.author) {
            this.props.model.contentModel.author = value;
        } else if (fieldType === EContentField.title) {
            this.props.model.contentModel.title = value;
        }
        let copy = this.props.model instanceof PostModel? PostModel.Copy(this.props.model) : CommentModel.Copy(this.props.model);
        this.props.dispatch(SavePostActionCreator(copy));
    };

    state = {
        contentBeforeEdit: this.props.model instanceof PostModel? PostModel.Copy(this.props.model) : CommentModel.Copy(this.props.model),
        isEditing: shouldEditModel(this.props.model.contentModel)
    };

    render() {
            return (
                <Card>
                    <CardContent>
                        {getTitleContent(this.props.model, this.state.isEditing, this.handleTextChange)}
                        <Row>
                            <Col xs={8}>
                                <TextContent
                                    fieldType={EContentField.author}
                                    body={this.props.model.contentModel.author}
                                    extraText={"Author: "}
                                    isEditing={this.state.isEditing}
                                    handleTextChange={this.handleTextChange}
                                >
                                </TextContent>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8}>
                                <TextContent
                                    fieldType={EContentField.body}
                                    body={this.props.model.contentModel.body}
                                    extraText={""}
                                    isEditing={this.state.isEditing}
                                    handleTextChange={this.handleTextChange}
                                >
                                </TextContent>
                            </Col>
                            <Col xs={2}>
                                <Votable votableModel={this.props.model.votableModel} />
                            </Col>
                        </Row>
                    </CardContent>
                    <CardActions>
                        {getModifyPostButtons(this.state.isEditing,
                            this.delete,
                            this.save,
                            this.editPost,
                            this.cancelEdit)}
                    </CardActions>
                </Card>
            )
    }
}

const getModifyPostButtons = (isEditing: boolean,
    deleteFunction: (event: React.MouseEvent<HTMLElement>) => void,
    saveFunction: (event: React.MouseEvent<HTMLElement>) => void,
    editPost: (event: React.MouseEvent<HTMLElement>) => void,
    cancelEdit: (event: React.MouseEvent<HTMLElement>) => void): JSX.Element => {
    if (isEditing) {
        return (
            <Row>
                <Col xs={1}>
                    <Button mini variant='fab' color='primary' onClick={saveFunction}>
                        <SaveIcon className='icon'/>
                    </Button>
                </Col>
                <Col xs={1} xsOffset={5}>
                    <Button mini variant='fab' color='secondary' onClick={cancelEdit}>
                        <CancelIcon className='icon'/>
                    </Button>
                </Col>
            </Row>
        );
    } else {
        return (
            <Row>
                <Col xs={1}>
                    <Button mini variant='fab' color='primary' onClick={editPost}>
                        <EditIcon className='icon'/>
                    </Button>
                </Col>
                <Col xs={1} xsOffset={5}>
                    <Button mini variant='fab' color='secondary' onClick={deleteFunction}>
                        <DeleteIcon className='icon'/>
                    </Button>
                </Col>
            </Row>
        );
    }
};

const getTitleContent = (model: PostModel | CommentModel, isEditing: boolean, handleTextChange: (val: string, type: EContentField) => void) => {
    if (model instanceof PostModel) {
        return (
            <Row>
                <Col xs={8}>
                    <TextContent
                        fieldType={EContentField.title}
                        body={model.contentModel.title}
                        extraText={"Title: "}
                        isEditing={isEditing}
                        handleTextChange={handleTextChange}
                    >
                    </TextContent>
                </Col>
            </Row>
        );
    }
    return
};

const shouldEditModel = (model: ContentModel): boolean => {
    return model.author === "" ||
        model.author == null ||
        model.body === "" ||
        model.body == null;
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)<ContentContainerAllProps>(ContentContainer));