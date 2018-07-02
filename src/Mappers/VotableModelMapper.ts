import VotableModel from '../Models/VotableModel';
import EVotableType from '../Enums/EVotableType';

class VotableModelMapper {

    public static entityToBusiness = (entity: any, parentId: string, type: EVotableType): VotableModel => {
        let model = new VotableModel();
        model.voteScore = entity.voteScore;
        model.parentId = parentId;
        model.type = type;
        return model;
    }
}

export default VotableModelMapper;