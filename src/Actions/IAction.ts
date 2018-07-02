import { Action } from 'redux';
import EActionType from '../Enums/EActionType';

interface IAction extends Action {
    type: EActionType;
}

export default IAction;