import * as React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import RootView from '../Components/RootView';
import PostDetailView from '../Components/PostDetailView';
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import AppStore from '../Reducers/AppStore';
import PostModel from '../Models/PostModel';
import { GetAllPostsActionCreator } from '../Actions/GetAllPosts';
import ReadableEngine from '../Engines/ReadableEngine';
import { GetAllCategoriesActionCreator } from '../Actions/GetAllCategories';
import CategoryModel from '../Models/CategoryModel';
import { ChangeCategoryActionCreator } from '../Actions/ChangeCategory';

interface AppDispatchProps {
    getAll: () => Promise<Array<PostModel>>;
    getCategories: () => Promise<Array<CategoryModel>>;
    dispatch: any;
}

interface AppProps extends RouteComponentProps<any> {
}

interface AppStoreProps {
    posts: Array<PostModel>;
    availableCategories: Array<CategoryModel>;
}

interface AppAllProps extends AppDispatchProps, AppStoreProps, AppProps {}

const mapDispatchToProps: MapDispatchToProps<AppDispatchProps, AppProps> = ((dispatch: any): AppDispatchProps => {
    return {
        getAll: ((): Promise<Array<PostModel>> =>{
            return ReadableEngine.GetAllPostsAndComments()
                .then((posts: Array<PostModel>) => {
                    dispatch(GetAllPostsActionCreator(posts));
                    return posts;
                });
        }),

        getCategories: ((): Promise<Array<CategoryModel>> => {
            return ReadableEngine.GetCategories()
                .then((categories: Array<CategoryModel>) => {
                    dispatch(GetAllCategoriesActionCreator(categories));
                    return categories;
                });
        }),

        dispatch: dispatch,
    }
});

const mapStateToProps: MapStateToProps<AppStoreProps, AppProps, AppStore> = ((state: AppStore): AppStoreProps => {
    return {
        posts: state.posts,
        availableCategories: state.availableCategories,
    }
});

class App extends React.Component<AppAllProps> {

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
        let getAllPromise = this.props.getAll();
        let getCategoriesPromise = this.props.getCategories();
        Promise.all([getAllPromise, getCategoriesPromise])
            .then(() => {
                let path = this.props.history.location.pathname;
                let searchPath = '/';
                if (path.split(searchPath).length == 2) {
                    let editPostPath = path.slice(path.lastIndexOf(searchPath) + searchPath.length);
                    let postCategory = this.props.availableCategories.find((category: CategoryModel) => {
                        return category.path === editPostPath;
                    });

                    if (postCategory != null) {
                        this.props.dispatch(ChangeCategoryActionCreator(postCategory));
                    }
                }
            })
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