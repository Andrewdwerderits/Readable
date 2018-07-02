import PostModel from '../Models/PostModel';
import IAction from '../Actions/IAction';
import EActionType from '../Enums/EActionType';

export class SAVE_POST implements IAction {
    public type: EActionType;
    public payload: PostModel;
}

export const SavePostActionCreator = ((model: PostModel): SAVE_POST => {
    return {
        type: EActionType.savePost,
        payload: model,
    }
});