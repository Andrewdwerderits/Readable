import IAction from '../Actions/IAction';
import PostModel from '../Models/PostModel';
import EActionType from '../Enums/EActionType';

export interface GET_ALL_POSTS extends IAction {
    type: EActionType;
    payload: Array<PostModel>;
}

export const GetAllPostsActionCreator = ((posts: Array<PostModel>): GET_ALL_POSTS => {
    return {
        type: EActionType.getAllPosts,
        payload: posts,
    }
});