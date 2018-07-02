import * as React from 'react';
import SimplePost from '../Components/SimplePost';
import Comment from '../Components/Comment';
import PostModel from '../Models/PostModel';
import CommentModel from '../Models/CommentModel';
import { connect, MapStateToProps } from 'react-redux'
import { RouteComponentProps, withRouter } from "react-router";
import AppStore from '../Reducers/AppStore';
import ReadableEngine from '../Engines/ReadableEngine';

interface PostDetailViewProps extends RouteComponentProps<any> {
    post: PostModel;
}

interface PostDetailViewStoreProps {
    editingPostId: string;
}

const mapStateToProps: MapStateToProps<PostDetailViewStoreProps, PostDetailViewProps, AppStore> = (state: AppStore): PostDetailViewStoreProps => {
    return {
        editingPostId: state.editingPostId,
    }
};

/* tslint:disable */
class PostDetailView extends React.Component<PostDetailViewProps & PostDetailViewStoreProps> {

    render() {
        let isEditing = ReadableEngine.isPostModelBeingEdited(this.props.post, this.props.editingPostId);

        return (
            <div>
                <SimplePost
                    key={this.props.post.id}
                    postModel={this.props.post}
                    isEditing={isEditing}
                    isExpanded={true}
                />

                {this.props.post.comments.map((comment: CommentModel) => {
                    return (
                        <Comment key={comment.id} commentModel={comment} isEditing={isEditing}/>
                    )})
                }
            </div>
        )
    }
}

export default withRouter(connect(
    mapStateToProps,
    null,
)(PostDetailView))