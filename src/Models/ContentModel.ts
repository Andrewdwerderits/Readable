import EContentType from '../Enums/EContentType';
import PostModel from '../Models/PostModel';

class ContentModel
{
    public id: string;
    public timestamp: number;
    public body: string;
    public author: string;
    public deleted: boolean;
    public title: string;
    public type: EContentType;
    public parentPost: PostModel;
    public existsOnServer: boolean;

    public static Copy(toCopy: ContentModel): ContentModel {

        let copy = new ContentModel();
        copy.id = toCopy.id;
        copy.body = toCopy.body;
        copy.author = toCopy.author;
        copy.deleted = toCopy.deleted;
        copy.title = toCopy.title;
        copy.type = toCopy.type;
        copy.parentPost = toCopy.parentPost;
        copy.existsOnServer = toCopy.existsOnServer;

        return copy;
    }
}

export default ContentModel;