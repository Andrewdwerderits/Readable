import * as React from 'react';
import VotableModel from '../Models/VotableModel';
import Button from '@material-ui/core/Button';
import ThumbsUp from '@material-ui/icons/ThumbUp'
import ThumbsDown from '@material-ui/icons/ThumbDown';
import Typography from '@material-ui/core/Typography';
import '../Styles/icon.css';
import '../Styles/text.css';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect, MapDispatchToProps } from 'react-redux';
import { VoteActionCreator } from '../Actions/Vote';
import ReadableEngine from '../Engines/ReadableEngine';

interface VotableProps {
    votableModel: VotableModel;
}

interface VotableDispatchProps {
    upvote: () => void;
    downVote: () => void;
}

const mapDispatchToProps: MapDispatchToProps<VotableDispatchProps, VotableProps> = ((dispatch: any, ownProps: VotableProps): VotableDispatchProps => {
    return {
        upvote: (() => {
            return ReadableEngine.Vote(ownProps.votableModel, true)
                .then((updatedModel: VotableModel) => {
                    dispatch(VoteActionCreator(updatedModel));
                });
        }),

        downVote: (() => {
            return ReadableEngine.Vote(ownProps.votableModel, false)
                .then((updatedModel: VotableModel) => {
                    dispatch(VoteActionCreator(updatedModel));
                });
        }),
    }
});

/* tslint:disable */
class Votable extends React.Component<VotableProps & VotableDispatchProps, any> {
    /* tslint:enable */

    render() {
        return (
            <Grid>
                <Row middle='xs'>
                    <Col xs={12} xsOffset={1}>
                        <Typography
                            className='text'
                        >Upvotes: {this.props.votableModel.voteScore}</Typography>
                    </Col>
                </Row>
                <Row>
                    <Col xs={1}>
                        <Button mini variant='fab' onClick={this.upVoteClick}>
                            <ThumbsUp className='icon'/>
                        </Button>
                    </Col>
                    <Col xs={1} xsOffset={2}>
                        <Button mini variant='fab' onClick={this.downVoteClick}>
                            <ThumbsDown className='icon'/>
                        </Button>
                    </Col>
                </Row>
            </Grid>
        )
    }

    public upVoteClick = ((event: React.MouseEvent<HTMLElement>) => {
        this.props.upvote();
    });

    public downVoteClick = ((event: React.MouseEvent<HTMLElement>) => {
        this.props.downVote();
    });
}

export default connect(
    null,
    mapDispatchToProps,
)(Votable)