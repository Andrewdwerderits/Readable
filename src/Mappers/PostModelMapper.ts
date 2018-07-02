import PostModel from '../Models/PostModel';
import CommentModel from '../Models/CommentModel';
import VotableModelMapper from '../Mappers/VotableModelMapper';
import EPostCategory from '../Enums/EPostCategory';
import ContentModelMapper from '../Mappers/ContentModelMapper'
import EVotableType from '../Enums/EVotableType';
import EContentType from '../Enums/EContentType';

class PostModelMapper {

    public static entityToBusiness = (entity: any, comments: Array<CommentModel> = []): PostModel => {
        let model = new PostModel();
        model.votableModel = VotableModelMapper.entityToBusiness(entity, entity.id, EVotableType.post);
        model.contentModel = ContentModelMapper.entityToBusiness(entity, EContentType.post, model);
        model.comments = comments;
        model.cateogry = EPostCategory[<string>entity.category];
        model.id = entity.id;
        return model;
    }
}

export default PostModelMapper;