import IAction from '../Actions/IAction';
import EActionType from '../Enums/EActionType';

export class EDIT_POST implements IAction {
    public type: EActionType;
    public payload: string;
}

export const EditPostActionCreator = ((editPostId: string): EDIT_POST => {
    return {
        type: EActionType.editPost,
        payload: editPostId,
    }
});