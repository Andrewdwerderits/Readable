import * as React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import RootView from './RootView';
import PostDetailView from './PostDetailView';
import { connect } from "react-redux";
import AppStore from '../Reducers/AppStore';
import PostModel from '../Models/PostModel';
import { GetAllPostsActionCreator } from '../Actions/GetAllPosts';
import ReadableEngine from '../Engines/ReadableEngine';
import { GetAllCategoriesActionCreator } from '../Actions/GetAllCategories';
import CategoryModel from '../Models/CategoryModel';

interface AppDispatchProps {
    getAll: () => void;
    getCategories: () => void;
}

interface AppProps extends RouteComponentProps<any> {
}

interface AppStoreProps {
    posts: Array<PostModel>;
    availableCategories: Array<CategoryModel>;
}

const mapDispatchToProps = ((dispatch: any): AppDispatchProps => {
    return {
        getAll: (() => {
            return ReadableEngine.GetAllPostsAndComments()
                .then((posts: Array<PostModel>) => {
                    dispatch(GetAllPostsActionCreator(posts));
                });
        }),

        getCategories: (() => {
            return ReadableEngine.GetCategories()
                .then((categories: Array<CategoryModel>) => {
                    dispatch(GetAllCategoriesActionCreator(categories));
                });
        }),
    }
});

const mapStateToProps = ((state: AppStore): AppStoreProps => {
    return {
        posts: state.posts,
        availableCategories: state.availableCategories,
    }
});

class App extends React.Component<AppStoreProps & AppDispatchProps & AppProps> {

    public render() {
        let path = this.props.history.location.pathname;
        let searchPath = '/';
        let editPostId = path.slice(path.lastIndexOf(searchPath)+searchPath.length);

        let postForEdit = this.getPostForEdit(editPostId);
        let postCategory = postForEdit.category;

        let availableCategoriesWithoutAll = this.props.availableCategories.filter((category: CategoryModel) => {
            return category.name !== "All";
        });

        return (
            <div>
                <Route exact path='/' render={() => (
                    <RootView/>
                )}/>

                {availableCategoriesWithoutAll.map((route: CategoryModel) => {
                    return (
                        <Route exact path={`/${route.path}`} key={route.path} render={() => (
                            <RootView/>
                        )}/>
                    )
                })}

                <Route exact path={`/${postCategory.path}/:id`} render={() => (
                    <PostDetailView post={postForEdit}/>
                )}/>
            </div>
        );
    }

    componentDidMount() {
        this.props.getAll();
        this.props.getCategories();
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