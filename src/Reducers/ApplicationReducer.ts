import IAction from '../Actions/IAction';
import AppStore from '../Reducers/AppStore';
import { GET_ALL_POSTS } from '../Actions/GetAllPosts';
import EActionType from '../Enums/EActionType';
import PostModel from  '../Models/PostModel';
import { VOTE_ACTION } from '../Actions/Vote';
import EVotableType from '../Enums/EVotableType';
import VotableModel from '../Models/VotableModel';
import CommentModel from '../Models/CommentModel';
import { SAVE_POST } from '../Actions/SavePost';
import { DELETE_POST } from '../Actions/DeletePost';
import EContentType from '../Enums/EContentType';
import { CHANGE_CATEGORY } from '../Actions/ChangeCategory';
import { GET_ALL_CATEGORIES } from '../Actions/GetAllCategories';
import CategoryModel from '../Models/CategoryModel';
import {TOGGLE_POST_DETAILS_MODE} from "src/Actions/TogglePostDetailsMode";

const initialState: AppStore = {
    posts: [],
    availableCategories: [],
    selectedCategory: new CategoryModel("All", ""),
    inPostDetailMode: false,
};

export const ApplicationReducer = (state: AppStore, action: IAction): AppStore => {

    if (typeof state === 'undefined') {
        return initialState;
    }
​
    switch(action.type) {
        case EActionType.vote:
            let voteAction = <VOTE_ACTION>action;
            return UpdateStateForVote(voteAction.payload, state);
        case EActionType.getAllPosts:
            let getAllAction = <GET_ALL_POSTS>action;
            return {
                ...state,
                posts: getAllAction.payload
            };
        case EActionType.savePost:
            let saveAction = <SAVE_POST>action;
            return updateStateForSave(saveAction.payload, state);
        case EActionType.deletePost:
            let deleteAction = <DELETE_POST>action;
            return updateStateForDelete(deleteAction.payload.id, deleteAction.payload.type, state);
        case EActionType.changeCategory:
            let changeCategoryAction = <CHANGE_CATEGORY>action;
            return updateStateForChangeCategory(changeCategoryAction.payload, state);
        case EActionType.getAllCategories:
            let getAllCategoriesAction = <GET_ALL_CATEGORIES>action;
            return updateStateForGetAllCategories(getAllCategoriesAction.payload, state);
        case EActionType.togglePostDetailsMode:
            let togglePostDetailsModeAction = <TOGGLE_POST_DETAILS_MODE>action;
            return updateStateForTogglePostDetailsMode(togglePostDetailsModeAction.payload, state);
        default:
            return state;
    }
};

const UpdateStateForVote = (votable: VotableModel, state: AppStore): AppStore => {
    let posts = state.posts.slice();

    switch(votable.type) {
        case EVotableType.post:
            let postForVotable = posts.find((post: PostModel) => {
                return post.id === votable.parentId;
            });

            if (postForVotable != null) {
                postForVotable.votableModel = votable;
            }
            break;
        case EVotableType.comment:

            let allComments: Array<CommentModel> = [];
            posts.forEach((post: PostModel) => {
                allComments = allComments.concat(post.comments);
            });

            let commentForVotable = allComments.find((comment: CommentModel) => {
                return comment.id === votable.parentId;
            });

            if (commentForVotable != null) {
                commentForVotable.votableModel = votable;
            }
            break;
        default:
            break;
    }
    return {
        ...state,
        posts: posts,
    };
};

const updateStateForSave = (post: PostModel | CommentModel, state: AppStore): AppStore => {
    let newPosts: PostModel[];

    if (post instanceof PostModel) {
        let postIndex = -1;
        newPosts = state.posts.filter((existingPost: PostModel, index: number) => {
            if (post.id !== existingPost.id) {
                return true;
            }
            postIndex = index;
            return false;
        });

        newPosts.splice(postIndex, 0, post);

    } else {
        newPosts = state.posts.splice(0);

        newPosts.forEach((oldPost: PostModel) => {
            let commentIndex = -1;
            let comments = oldPost.comments.filter((oldComment: CommentModel, index: number) => {

                oldComment.parentPost = oldPost;
                if (post.id !== oldComment.id) {
                    return true;
                }
                commentIndex = index;
                return false;
            });

            if (commentIndex != -1) {
                comments.splice(commentIndex, 0, post);
            }

            oldPost.comments = comments;
        })
    }

    return {
        ...state,
        posts: newPosts,
    }
};

const updateStateForDelete = (id: string, type: EContentType, state: AppStore): AppStore => {
    let posts = state.posts.slice();

    if (type === EContentType.comment) {
        posts.forEach((post: PostModel) => {
            post.comments = post.comments.filter((commentModel: CommentModel) => {
                return commentModel.id !== id;
            });
        });
        return {
            ...state,
            posts: posts
        }

    } else {
        return {
            ...state,
            posts: state.posts.filter((post: PostModel) => {
                return post.id !== id;
            }),
        }
    }
};

const updateStateForChangeCategory = (category: CategoryModel, state: AppStore): AppStore => {
    return {
        ...state,
        selectedCategory: category,
    }
};

const updateStateForGetAllCategories = (categories: Array<CategoryModel>, state: AppStore): AppStore => {
    return {
        ...state,
        availableCategories: categories,
    }
};

const updateStateForTogglePostDetailsMode = (enterPostDetails: boolean, state: AppStore): AppStore => {
    return {
        ...state,
        inPostDetailMode: enterPostDetails,
    }
};