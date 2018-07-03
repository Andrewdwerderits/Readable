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

    static Copy(toCopy: CommentModel): CommentModel {
        let copy = new CommentModel;
        copy.id = toCopy.id;
        copy.votableModel.parentId = toCopy.votableModel.parentId;
        copy.votableModel.voteScore = toCopy.votableModel.voteScore;
        copy.votableModel.type = toCopy.votableModel.type;
        copy.contentModel = ContentModel.Copy(toCopy.contentModel);
        copy.parentPost = toCopy.parentPost;
        copy.parentDeleted = toCopy.parentDeleted;

        return copy;
    }
}

export default CommentModel;