import PostModel from '../Models/PostModel';
import CommentModel from '../Models/CommentModel';
import IAction from '../Actions/IAction';
import EActionType from '../Enums/EActionType';

export interface SAVE_POST extends IAction {
    type: EActionType;
    payload: PostModel | CommentModel;
}

export const SavePostActionCreator = ((model: PostModel | CommentModel): SAVE_POST => {
    return {
        type: EActionType.savePost,
        payload: model,
    }
});