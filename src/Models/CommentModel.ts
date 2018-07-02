import VotableModel from '../Models/VotableModel';
import ContentModel from '../Models/ContentModel';
import PostModel from '../Models/PostModel';

class CommentModel {
    public id: string;
    public votableModel: VotableModel;
    public contentModel: ContentModel;
    public parentPost: PostModel;
    public parentDeleted: boolean;

    constructor() {
        this.votableModel = new VotableModel();
        this.contentModel = new ContentModel();
    }
}

export default CommentModel;