import IAction from '../Actions/IAction';
import EActionType from '../Enums/EActionType';
import EContentType from '../Enums/EContentType';

export class DELETE_POST implements IAction {
    public type: EActionType;
    public payload: deletePostPayload;
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