import IAction from '../Actions/IAction';
import EActionType from '../Enums/EActionType';

export interface TOGGLE_POST_DETAILS_MODE extends IAction {
    type: EActionType;
    payload: boolean;
}

export const TogglePostDetailsModeActionCreator = ((enterPostDetails: boolean): TOGGLE_POST_DETAILS_MODE => {
    return {
        type: EActionType.togglePostDetailsMode,
        payload: enterPostDetails,
    }
});