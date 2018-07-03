import IAction from '../Actions/IAction';
import EActionType from '../Enums/EActionType';
import CategoryModel from '../Models/CategoryModel';

export interface GET_ALL_CATEGORIES extends IAction {
    type: EActionType;
    payload: Array<CategoryModel>;
}

export const GetAllCategoriesActionCreator = ((categories: Array<CategoryModel>): GET_ALL_CATEGORIES => {
    return {
        type: EActionType.getAllCategories,
        payload: categories,
    }
});