import IAction from '../Actions/IAction';
import EActionType from '../Enums/EActionType';
import CategoryModel from '../Models/CategoryModel';

export interface CHANGE_CATEGORY extends IAction {
    type: EActionType;
    payload: CategoryModel;
}

export const ChangeCategoryActionCreator = ((category: CategoryModel): CHANGE_CATEGORY => {
    return {
        type: EActionType.changeCategory,
        payload: category,
    }
});