import * as React from 'react';
import SimplePost from '../Components/SimplePost';
import PostModel from '../Models/PostModel';
import CommentModel from '../Models/CommentModel';
import {connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import { RouteComponentProps, withRouter } from "react-router";
import Button from '@material-ui/core/Button';
import { SavePostActionCreator } from '../Actions/SavePost';
import EContentType from '../Enums/EContentType';
import * as uuid from "uuid";
import ContentContainer from '../Components/ContentContainer';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CategoryView from '../Components/CategoryView';
import CategoryModel from '../Models/CategoryModel';
import AppStore from '../Reducers/AppStore';
import { Row } from 'react-flexbox-grid';

interface PostDetailViewProps extends RouteComponentProps<any> {
    post: PostModel;
}

interface PostDetailViewDispatchProps {
    addComment: () => void;
}

interface PostDetailViewStoreProps {
    selectedCategory: CategoryModel;
}

interface PostDetailAllProps extends PostDetailViewStoreProps, PostDetailViewDispatchProps, PostDetailViewProps {}

const mapDispatchToProps: MapDispatchToProps<PostDetailViewDispatchProps, PostDetailViewProps> = (dispatch: any, ownProps: PostDetailViewProps): PostDetailViewDispatchProps => {
    return {
        addComment: (() => {
            let newComment = new CommentModel();
            newComment.id = uuid.v1();
            newComment.votableModel.parentId = newComment.id;
            newComment.contentModel.id = newComment.id;

            newComment.parentPost = ownProps.post;
            newComment.contentModel.timestamp = Date.now();
            newComment.contentModel.type = EContentType.comment;
            newComment.contentModel.deleted = false;
            newComment.contentModel.existsOnServer = false;

            ownProps.post.comments.push(newComment);

            dispatch(SavePostActionCreator(ownProps.post));
        }),
    }
};

const mapStateToProps: MapStateToProps<PostDetailViewStoreProps, PostDetailViewProps, AppStore> = ((state: AppStore): PostDetailViewStoreProps => {
    return {
        selectedCategory: state.selectedCategory,
    }
});

/* tslint:disable */
class PostDetailView extends React.Component<PostDetailAllProps> {

    render() {
        return (
            <div>
                <Row>
                    <CategoryView category={this.props.selectedCategory}/>
                </Row>
                <Row>
                    <SimplePost
                        key={this.props.post.id}
                        postModel={this.props.post}
                        isExpanded={true}
                    />
                    {this.props.post.comments.map((comment: CommentModel) => {
                        return (
                            <Card key={comment.id}>
                                <CardContent>
                                    <ContentContainer model={comment}/>
                                </CardContent>
                            </Card>
                        )})
                    }
                </Row>
                <Row>
                    <Button color='primary'
                            onClick={this.props.addComment}>Add new comment
                    </Button>
                </Row>
            </div>
        )
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(PostDetailView))