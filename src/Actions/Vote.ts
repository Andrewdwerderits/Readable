import VotableModel from '../Models/VotableModel';
import IAction from '../Actions/IAction';
import EActionType from '../Enums/EActionType';

export class VOTE_ACTION implements IAction {
        public type: EActionType;
        public payload: VotableModel;
}

export const VoteActionCreator = ((model: VotableModel): VOTE_ACTION => {
    return {
        type: EActionType.vote,
        payload: model,
    }
});