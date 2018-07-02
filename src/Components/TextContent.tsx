import * as React from 'react';
// import ContentModel from '../Models/ContentModel';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import { Row, Col } from 'react-flexbox-grid';
import '../Styles/icon.css';
import '../Styles/text.css';
import ReadableEngine from '../Engines/ReadableEngine';
import { SavePostActionCreator } from '../Actions/SavePost';
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import PostModel from '../Models/PostModel';
import {ChangeEvent} from "react";
import { DeletePostActionCreator } from '../Actions/DeletePost';
// import AppStore from '../Reducers/AppStore';
import { EditPostActionCreator } from '../Actions/EditPost';
import { LeaveEditModeActionCreator } from '../Actions/LeaveEditMode';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import EContentType from '../Enums/EContentType';
import EContentField from '../Enums/EContentField';
import CommentModel from '../Models/CommentModel';
import AppStore from '../Reducers/AppStore';
import ContentModel from '../Models/ContentModel';

interface TextContentProps extends RouteComponentProps<any> {
    id: string;
    postType: EContentType;
    fieldType: EContentField;
    parentPost: PostModel;
    body: string;
    isEditing: boolean;
    extraText: string;
}

interface TextContentDispatchProps {
    deletePost: () => void;
    savePost: () => void;
    doneEditingPost: () => void;
    editPost: () => void;
    dispatch: any;
}

interface TextContentStoreProps {
    posts: PostModel[];
}

// interface TextContentMergeProps {
//     editPost: () => void;
//     deletePost: () => void;
//     savePost: (state: TextContentState) => void;
//     doneEditingPost: () => void;
// }

interface TextContentAllProps extends TextContentProps, TextContentDispatchProps {}

const mapDispatchToProps: MapDispatchToProps<TextContentDispatchProps, TextContentProps> = (dispatch: any, ownProps: TextContentProps): TextContentDispatchProps => {
    return {
        deletePost: (() => {
            let id = ownProps.id;
            return ReadableEngine.DeletePost(id, ownProps.postType)
                .then(() => {
                    dispatch(DeletePostActionCreator(id, ownProps.postType));
                });
        }),

        savePost: (() => {
            return ReadableEngine.SavePost(ownProps.parentPost)
                .then((updatedModel: PostModel) => {
                    dispatch(SavePostActionCreator(updatedModel));
                });
        }),

        doneEditingPost: (() => {
            dispatch(LeaveEditModeActionCreator());
        }),

        editPost: (() => {
            dispatch(EditPostActionCreator(ownProps.parentPost.id));
        }),

        dispatch: dispatch,
    }
};

const mapStateToProps: MapStateToProps<TextContentStoreProps, TextContentProps, AppStore> = (state: AppStore): TextContentStoreProps => {
    return {
        posts: state.posts,
    }
};

// const mergeProps: MergeProps<TextContentStoreProps, any, TextContentProps, TextContentMergeProps> = (stateProps: TextContentStoreProps, dispatch: any, ownProps: TextContentProps):TextContentMergeProps => {
//     return {
//         ...stateProps,
//         ...dispatch,
//         ...ownProps,
//         editPost: (() => {
//             let postModel = ReadableEngine.GetPostForContentModel(stateProps.posts, ownProps.contentModel);
//             dispatch(EditPostActionCreator(postModel.id));
//         }),
//         deletePost: (() => {
//             let id = ownProps.contentModel.id;
//             return ReadableEngine.DeletePost(ownProps.contentModel)
//                 .then(() => {
//                     dispatch(DeletePostActionCreator(id));
//                 });
//         }),
//
//         savePost: ((state: TextContentState) => {
//             let contentModel: ContentModel = {
//                 ...ownProps.contentModel,
//             };
//             contentModel.body = state.text;
//
//             return ReadableEngine.SavePost(contentModel)
//                 .then((updatedModel: PostModel) => {
//                     dispatch(SavePostActionCreator(updatedModel));
//                 });
//         }),
//
//         doneEditingPost: (() => {
//             dispatch(LeaveEditModeActionCreator());
//         }),
//     }
// };

 /* tslint:disable */
class TextContent extends React.Component<TextContentAllProps> {
    /* tslint:enable */

    state = {
        text: this.props.body
    };

    public editPost = (event: React.MouseEvent<HTMLElement>) => {
        this.props.editPost();
    };

    public delete = (event: React.MouseEvent<HTMLElement>) => {
        this.props.deletePost();
    };

    public save = (event: React.MouseEvent<HTMLElement>) => {
        this.props.savePost();
        this.props.doneEditingPost();
    };

    public doneEditingPost = (event: React.MouseEvent<HTMLElement>) => {
        this.props.doneEditingPost();
    };

    public handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        let val = event.target.value;
        if (this.props.postType === EContentType.comment) {
            this.props.parentPost.comments.forEach((comment: CommentModel) => {
                if (comment.id === this.props.id) {
                    updateFieldWithValue(comment.contentModel, this.props.fieldType, val);
                }
            });
        } else {
            updateFieldWithValue(this.props.parentPost.contentModel, this.props.fieldType, val);
        }

        this.props.dispatch(SavePostActionCreator(this.props.parentPost));
    };

    render() {
        if (this.props.fieldType === EContentField.body) {
            return (
                <Card>
                    <CardContent>
                        <Row>
                            <Col xs={12}>
                                <TextField
                                    name='textField'
                                    fullWidth
                                    onChange={this.handleTextChange}
                                    disabled={!this.props.isEditing}
                                    multiline
                                    className='text'
                                    defaultValue={this.props.body}>
                                </TextField>
                            </Col>
                        </Row>
                    </CardContent>
                    <CardActions>
                        {selectButtons(this.props.isEditing,
                            this.props.id,
                            this.delete,
                            this.save,
                            this.editPost,
                            this.doneEditingPost)}
                    </CardActions>
                </Card>
            )
        } else {
            return (
            <Row>
                <Col xs>
                    {this.props.extraText}
                </Col>
                <Col xs>
                    <TextField
                        name='textField'
                        fullWidth
                        onChange={this.handleTextChange}
                        disabled={!this.props.isEditing}
                        multiline
                        className='text'
                        defaultValue={this.props.body}>
                    </TextField>
                </Col>
            </Row>
            );
        }
    }
}

const selectButtons = (isEditing: boolean,
    postId: string,
    deleteFunction: (event: React.MouseEvent<HTMLElement>) => void,
    saveFunction: (event: React.MouseEvent<HTMLElement>) => void,
    editPost: (event: React.MouseEvent<HTMLElement>) => void,
    doneEditingPost: (event: React.MouseEvent<HTMLElement>) => void): JSX.Element => {
    if (isEditing) {
        return (
            <Row>
                <Col xs={1}>
                    <Button mini variant='fab' color='primary' onClick={saveFunction}>
                        <SaveIcon className='icon'/>
                    </Button>
                </Col>
                <Col xs={1} xsOffset={5}>
                    <Button mini variant='fab' color='secondary' onClick={doneEditingPost}>
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

const updateFieldWithValue = (contentModel: ContentModel, fieldType: EContentField, value: string) => {
    if (fieldType === EContentField.body) {
        contentModel.body = value;
    } else if (fieldType === EContentField.author) {
        contentModel.author = value;
    } else if (fieldType === EContentField.title) {
        contentModel.title = value;
    }
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)<TextContentAllProps>(TextContent));