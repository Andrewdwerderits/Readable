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
import {EDIT_POST} from "src/Actions/EditPost";
import EContentType from "src/Enums/EContentType";

/* tslint:disable */
const ApplicationReducer = (state: AppStore, action: IAction) => {
    /*tslint:enable */

    if (typeof state === 'undefined') {
        return {
            posts: [],
            editingPostId: "",
        }
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
        case EActionType.editPost:
            let editAction = <EDIT_POST>action;
            return {
                ...state,
                editingPostId: editAction.payload,
            };
        case EActionType.leaveEdit:
            return {
                ...state,
                editingPostId: "",
            };
        default:
            return state;
    }
};

const UpdateStateForVote = (votable: VotableModel, state: AppStore) => {
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

const updateStateForSave = (post: PostModel, state: AppStore) => {
    let postIndex = -1;

    let newPosts = state.posts.filter((existingPost: PostModel, index: number) => {
        if (post.id !== existingPost.id) {
            return true;
        }
        postIndex = index;
        return false;
    });

    newPosts.splice(postIndex, 0, post);

    return {
        ...state,
        posts: newPosts,
    }
};

const updateStateForDelete = (id: string, type: EContentType, state: AppStore) => {
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

export default ApplicationReducer;