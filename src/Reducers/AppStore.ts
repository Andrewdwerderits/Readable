import PostModel from '../Models/PostModel';
import CategoryModel from '../Models/CategoryModel';

interface AppStore {
    posts: Array<PostModel>;
    selectedCategory: CategoryModel;
    availableCategories: CategoryModel[];
    inPostDetailMode: boolean;
}


export default AppStore;