import VotableModel from '../Models/VotableModel';
import IAction from '../Actions/IAction';
import EActionType from '../Enums/EActionType';

export interface VOTE_ACTION extends IAction {
        type: EActionType;
        payload: VotableModel;
}

export const VoteActionCreator = ((model: VotableModel): VOTE_ACTION => {
    return {
        type: EActionType.vote,
        payload: model,
    }
});