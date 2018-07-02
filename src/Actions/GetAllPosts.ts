import IAction from '../Actions/IAction';
import PostModel from '../Models/PostModel';
import EActionType from '../Enums/EActionType';

export class GET_ALL_POSTS implements IAction {
    public type: EActionType;
    public payload: Array<PostModel>;
}

export const GetAllPostsActionCreator = ((posts: Array<PostModel>): GET_ALL_POSTS => {
    return {
        type: EActionType.getAllPosts,
        payload: posts,
    }
});