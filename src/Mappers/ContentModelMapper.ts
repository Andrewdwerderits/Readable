import ContentModel from '../Models/ContentModel';
import PostModel from '../Models/PostModel';
import EContentType from '../Enums/EContentType';

class ContentModelMapper {
    public static entityToBusiness = (entity: any, type: EContentType, parentPost: PostModel): ContentModel => {
        let model = new ContentModel();
        model.id = entity.id;
        model.timestamp = entity.timestamp;
        model.body = entity.body;
        model.author = entity.author;
        model.deleted = entity.deleted;
        model.title = entity.title;
        model.type = type;
        model.parentPost = parentPost;
        return model;
    }
}

export default ContentModelMapper;