import VotableModel from '../Models/VotableModel';
import CommentModel from '../Models/CommentModel';
import ContentModel from '../Models/ContentModel';
import EPostCategory from '../Enums/EPostCategory';

class PostModel {
    public votableModel: VotableModel;
    public contentModel: ContentModel;
    public comments: Array<CommentModel>;
    public cateogry: EPostCategory;
    public id: string;

    constructor() {
        this.comments = [];
        this.votableModel = new VotableModel();
        this.contentModel = new ContentModel();
    }
}

export default PostModel;