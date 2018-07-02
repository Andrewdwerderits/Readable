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
}

export default ContentModel;