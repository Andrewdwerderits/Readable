import * as React from 'react';
import SimplePost from '../Components/SimplePost';
import PostModel from '../Models/PostModel';
import AppStore from '../Reducers/AppStore';
import {connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import ReadableEngine from '../Engines/ReadableEngine';
import { GetAllPostsActionCreator } from '../Actions/GetAllPosts';
import Button from '@material-ui/core/Button';
import EContentType from "src/Enums/EContentType";
import {SavePostActionCreator} from '../Actions/SavePost';
import * as uuid from "uuid";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import CategoryView from '../Components/CategoryView';
import CategoryModel from '../Models/CategoryModel';
import ESortType from '../Enums/ESortType';
import { SortPostActionCreator } from "src/Actions/SortPosts";
import { Row } from 'react-flexbox-grid';
import {TogglePostDetailsModeActionCreator} from '../Actions/TogglePostDetailsMode';

interface RootViewProps extends RouteComponentProps<any> {
}

interface RootViewDispatchProps {
    getAll: () => void;
    dispatch: any;
}

interface RootViewStoreProps {
    posts: Array<PostModel>;
    selectedCategory: CategoryModel;
}

interface RootViewAllProps extends RootViewProps, RootViewStoreProps, RootViewDispatchProps {}

const mapStateToProps: MapStateToProps<RootViewStoreProps, RootViewProps, AppStore> = ((state: AppStore): RootViewStoreProps => {
    return {
        posts: state.posts,
        selectedCategory: state.selectedCategory,
    }
});

const mapDispatchToProps: MapDispatchToProps<RootViewDispatchProps, RootViewProps> = ((dispatch: any, ownProps: RootViewProps): RootViewDispatchProps => {
    return {
        getAll: (() => {
            return ReadableEngine.GetAllPostsAndComments()
                .then((posts: Array<PostModel>) => {
                    dispatch(GetAllPostsActionCreator(posts));
                });
        }),

        dispatch: dispatch,
    }
});

/* tslint:disable */
class RootView extends React.Component<RootViewAllProps>{
    /* tslint:enable */

    public addPost = () => {
        let newPost = new PostModel();
        newPost.id = uuid.v1();
        newPost.category = this.props.selectedCategory;

        newPost.votableModel.parentId = newPost.id;
        newPost.contentModel.id = newPost.id;

        newPost.contentModel.timestamp = Date.now();
        newPost.contentModel.type = EContentType.post;
        newPost.contentModel.deleted = false;
        newPost.contentModel.existsOnServer = false;

        this.props.dispatch(SavePostActionCreator(newPost));
        this.props.dispatch(TogglePostDetailsModeActionCreator(true));
        this.props.history.push(`/${newPost.category.path}/${newPost.id}`);
    };

    public setSortTypeHighestVote = (event: React.MouseEvent<HTMLElement>) => {
        this.props.dispatch(SortPostActionCreator(sort(this.props.posts, ESortType.highestVote)));
    };

    public setSortTypeLatestDate = (event: React.MouseEvent<HTMLElement>) => {
        this.props.dispatch(SortPostActionCreator(sort(this.props.posts, ESortType.latestDate)));
    };

    render() {

        let filteredPosts = this.props.posts.filter((post: PostModel) => {
            return post.category.name === this.props.selectedCategory.name ||
                this.props.selectedCategory.name === "All";
        });

        return (
            <div>
                <Row>
                    <CategoryView category={this.props.selectedCategory}/>
                </Row>
                <Row>
                    <Button color='primary'
                        variant='outlined'
                        onClick={this.setSortTypeHighestVote}>
                        Sort By Highest Vote
                    </Button>
                    <Button color='primary'
                        variant='outlined'
                        onClick={this.setSortTypeLatestDate}>
                        Sort By Date
                    </Button>
                </Row>
                <Row>
                    {filteredPosts.map((post: PostModel) => {
                        return (
                            <SimplePost
                                key={post.id}
                                postModel={post}
                                isExpanded={false}
                            >
                            </SimplePost>
                        );
                    })}
                </Row>
                <Row>
                    <Button color='primary'
                            onClick={this.addPost}>Add new post
                    </Button>
                </Row>
            </div>
        )
    }
}

const sort = (posts: Array<PostModel>, sortType: ESortType): Array<PostModel> => {
        if (sortType === ESortType.latestDate) {
            return sortByLatestDate(posts);
        } else if (sortType === ESortType.highestVote) {
            return sortByHighestVote(posts);
        }
        return posts;
};

const sortByLatestDate = (posts: Array<PostModel>) => {
    return posts.sort((postA: PostModel, postB: PostModel) => {
        if (postA.contentModel.timestamp > postB.contentModel.timestamp) {
            return -1;
        }
        return postA.contentModel.timestamp < postB.contentModel.timestamp ? 1 : 0;
    });
};

const sortByHighestVote = (posts: Array<PostModel>) => {
    return posts.sort((postA: PostModel, postB: PostModel) => {
        if(postA.votableModel.voteScore > postB.votableModel.voteScore) {
            return -1;
        }
        return postA.votableModel.voteScore < postB.votableModel.voteScore ? 1 : 0;
    });
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(RootView));