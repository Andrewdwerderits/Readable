import * as React from 'react';
import SimplePost from '../Components/SimplePost';
import PostModel from '../Models/PostModel';
import AppStore from '../Reducers/AppStore';
import { connect } from 'react-redux'
import ReadableEngine from '../Engines/ReadableEngine';
import { GetAllPostsActionCreator } from '../Actions/GetAllPosts';
import { LeaveEditModeActionCreator } from '../Actions/LeaveEditMode';

class RootViewProps {
}

class RootViewDispatchProps {
    public getAll: () => void;
    public stopEditing: () => void;
}

class RootViewStoreProps {
    posts: Array<PostModel>;
    editPostId: string;
}

const mapStateToProps = ((state: AppStore): RootViewStoreProps => {
    return {
        posts: state.posts,
        editPostId: state.editingPostId,
    }
});

const mapDispatchToProps = ((dispatch: any, ownProps: RootViewProps): RootViewDispatchProps => {
    return {
        getAll: (() => {
            return ReadableEngine.GetAllPostsAndComments()
                .then((posts: Array<PostModel>) => {
                    dispatch(GetAllPostsActionCreator(posts));
                });
        }),

        stopEditing: (() => {
            dispatch(LeaveEditModeActionCreator());
        }),
    }
});

/* tslint:disable */
class RootView extends React.Component<RootViewProps & RootViewDispatchProps & RootViewStoreProps, any>{
    /* tslint:enable */

    // public mapDispatchToProps = ((dispatch: any) => {
    //     return
    // });

    render() {
        return (
            <div>
                {this.props.posts.map((post: PostModel) => {
                    return (
                        <SimplePost
                            key={post.id}
                            postModel={post}
                            isEditing={ReadableEngine.isPostModelBeingEdited(post, this.props.editPostId)}
                            isExpanded={false}
                        >
                        </SimplePost>
                    );
                })}
            </div>
        )
    }

    componentDidMount() {
        this.props.stopEditing();
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RootView)