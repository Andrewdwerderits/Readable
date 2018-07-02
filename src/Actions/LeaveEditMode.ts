import IAction from '../Actions/IAction';
import EActionType from '../Enums/EActionType';

export class LEAVE_EDIT implements IAction {
    public type: EActionType;
}

export const LeaveEditModeActionCreator = ((): LEAVE_EDIT => {
    return {
        type: EActionType.leaveEdit,
    }
});