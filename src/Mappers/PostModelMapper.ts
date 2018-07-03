import PostModel from '../Models/PostModel';
import CommentModel from '../Models/CommentModel';
import VotableModelMapper from '../Mappers/VotableModelMapper';
import ContentModelMapper from '../Mappers/ContentModelMapper'
import EVotableType from '../Enums/EVotableType';
import EContentType from '../Enums/EContentType';
import CategoryModelMapper from '../Mappers/CategoryModelMapper';

class PostModelMapper {

    public static entityToBusiness = (entity: any, comments: Array<CommentModel> = []): PostModel => {
        let model = new PostModel();
        model.votableModel = VotableModelMapper.entityToBusiness(entity, entity.id, EVotableType.post);
        model.contentModel = ContentModelMapper.entityToBusiness(entity, EContentType.post, model);
        model.comments = comments;
        model.category = CategoryModelMapper.entityToBusiness(entity.category);
        model.id = entity.id;
        return model;
    };

    public static BusinessToEntity = (postModel: PostModel): any => {
        return {
            id: postModel.id,
            timestamp: postModel.contentModel.timestamp,
            title: postModel.contentModel.title,
            body: postModel.contentModel.body,
            author: postModel.contentModel.author,
            category: postModel.category,
            voteScore: postModel.votableModel.voteScore,
            deleted: postModel.contentModel.deleted,
        }
    };
}

export default PostModelMapper;