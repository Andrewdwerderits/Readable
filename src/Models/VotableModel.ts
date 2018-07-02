import EVotableType from '../Enums/EVotableType';

class VotableModel {
    public voteScore: number;
    public parentId: string;
    public type: EVotableType;
}

export default VotableModel;