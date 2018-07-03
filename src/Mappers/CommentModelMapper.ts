import CommentModel from '../Models/CommentModel';
import PostModel from '../Models/PostModel';
import VotableModelMapper from '../Mappers/VotableModelMapper';
import ContentModelMapper from '../Mappers/ContentModelMapper';
import EVotableType from '../Enums/EVotableType';
import EContentType from '../Enums/EContentType';

class CommentModelMapper {

    public static entityToBusiness = (entity: any, parentPost: PostModel): CommentModel => {
        let model = new CommentModel();
        model.id = entity.id;
        model.votableModel = VotableModelMapper.entityToBusiness(entity, entity.id, EVotableType.comment);
        model.contentModel = ContentModelMapper.entityToBusiness(entity, EContentType.comment, parentPost);
        model.parentPost = parentPost;
        model.parentDeleted = entity.parentDeleted;
        return model;
    };

    public static BusinessToEntity = (commentModel: CommentModel): any => {
        return {
            id: commentModel.id,
            parentId: commentModel.parentPost.id,
            timestamp: commentModel.contentModel.timestamp,
            body: commentModel.contentModel.body,
            author: commentModel.contentModel.author,
            voteScore: commentModel.votableModel.voteScore,
            deleted: commentModel.contentModel.deleted,
            parentDeleted: commentModel.parentDeleted,
        }
    };
}

export default CommentModelMapper;