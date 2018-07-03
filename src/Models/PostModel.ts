import VotableModel from '../Models/VotableModel';
import CommentModel from '../Models/CommentModel';
import ContentModel from '../Models/ContentModel';
import CategoryModel from '../Models/CategoryModel';

class PostModel {
    public votableModel: VotableModel;
    public contentModel: ContentModel;
    public comments: Array<CommentModel>;
    public category: CategoryModel;
    public id: string;

    constructor() {
        this.comments = [];
        this.votableModel = new VotableModel();
        this.contentModel = new ContentModel();
        this.category = new CategoryModel("", "");
    }

    static Copy(toCopy: PostModel): PostModel {
        let copy = new PostModel;
        copy.id = toCopy.id;
        copy.votableModel.parentId = toCopy.votableModel.parentId;
        copy.votableModel.voteScore = toCopy.votableModel.voteScore;
        copy.votableModel.type = toCopy.votableModel.type;
        copy.contentModel = ContentModel.Copy(toCopy.contentModel);
        copy.contentModel.parentPost = copy;
        copy.category = toCopy.category;

        copy.comments = toCopy.comments.map((commentModel: CommentModel) => {
            let commentCopy = CommentModel.Copy(commentModel);
            commentCopy.parentPost = copy;
            return commentCopy;
        });

        copy.category.name = toCopy.category.name;
        copy.category.path = toCopy.category.path;

        return copy;
    }
}

export default PostModel;