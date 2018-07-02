import * as React from 'react';
import {Route, RouteComponentProps, withRouter} from 'react-router-dom';
import RootView from './RootView';
import PostDetailView from './PostDetailView';
import {connect} from "react-redux";
import AppStore from '../Reducers/AppStore';
import PostModel from '../Models/PostModel';
import {GetAllPostsActionCreator} from '../Actions/GetAllPosts';
import ReadableEngine from '../Engines/ReadableEngine';

interface AppDispatchProps {
    getAll: () => void;
}

interface AppProps extends RouteComponentProps<any> {
}

interface AppStoreProps {
    posts: Array<PostModel>;
}

const mapDispatchToProps = ((dispatch: any): AppDispatchProps => {
    return {
        getAll: (() => {
            return ReadableEngine.GetAllPostsAndComments()
                .then((posts: Array<PostModel>) => {
                    dispatch(GetAllPostsActionCreator(posts));
                });
        }),
    }
});

const mapStateToProps = ((state: AppStore): AppStoreProps => {
    return {
        posts: state.posts,
    }
});

class App extends React.Component<AppStoreProps & AppDispatchProps & AppProps> {

    // public componentDidMount(): void {
    // }

    public render() {
        let path = this.props.history.location.pathname;
        let searchPath = '/edit/';
        let editPostId = path.slice(path.lastIndexOf(searchPath)+searchPath.length);

        let postForEdit = this.getPostForEdit(editPostId);

        return (
            <div>
                <Route exact path='/' render={() => (
                    <RootView/>
                )}/>

                <Route path='/edit' render={() => (
                    <PostDetailView post={postForEdit}/>
                )}/>
            </div>
        );
    }

    componentDidMount() {
        this.props.getAll();
    }

    private getPostForEdit(postId: string): PostModel {
        let postForEdit = new PostModel();

        if (postId != null) {
            let postInList = this.props.posts.find((post: PostModel) => {
                return post.id === postId;
            });

            if (postInList != null) {
                return postInList;
            }
        }
        return postForEdit;
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(App))