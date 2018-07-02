import PostModel from '../Models/PostModel';
import * as Redux from 'redux';

interface AppStore extends Redux.Store {
    posts: Array<PostModel>;
    editingPostId: string;
}


export default AppStore;