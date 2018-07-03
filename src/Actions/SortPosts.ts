import PostModel from '../Models/PostModel';
import IAction from '../Actions/IAction';
import EActionType from '../Enums/EActionType';

export interface SORT_POST extends IAction {
    type: EActionType;
    payload: Array<PostModel>;
}

export const SortPostActionCreator = ((sortedPosts: Array<PostModel>): SORT_POST => {
    return {
        type: EActionType.savePost,
        payload: sortedPosts,
    }
});