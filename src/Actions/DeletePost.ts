import IAction from '../Actions/IAction';
import EActionType from '../Enums/EActionType';
import EContentType from '../Enums/EContentType';

export interface DELETE_POST extends IAction {
    type: EActionType;
    payload: deletePostPayload;
}

interface deletePostPayload {
    id: string,
    type: EContentType;
}

export const DeletePostActionCreator = ((id: string, type: EContentType): DELETE_POST => {
    return {
        type: EActionType.deletePost,
        payload: {
            id,
            type
        },
    }
});