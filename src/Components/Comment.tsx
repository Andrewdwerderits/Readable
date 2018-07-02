import * as React from 'react';
import CommentModel from '../Models/CommentModel';
import Votable from '../Components/Votable';
import TextContent from '../Components/TextContent';
import Card from '@material-ui/core/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CardContent from '@material-ui/core/CardContent';
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
// import PostModel from "src/Models/PostModel";
import EContentType from '../Enums/EContentType';
import EContentField from '../Enums/EContentField';

const styles = {

};

interface CommentProps {
    commentModel: CommentModel;
    isEditing: boolean;
}

/* tslint:disable */
class Comment extends React.Component<CommentProps & WithStyles<''>, any>{
    /* tslint:enable */

    render() {
        return (
            <Grid fluid>
                <Row>
                    <Card >
                        <CardContent>
                            <Row>
                                <Col xs={6}>
                                    <TextContent
                                        id={this.props.commentModel.id}
                                        postType={EContentType.comment}
                                        fieldType={EContentField.body}
                                        parentPost={this.props.commentModel.parentPost}
                                        body={this.props.commentModel.contentModel.body}
                                        extraText={""}
                                        isEditing={this.props.isEditing}
                                    >
                                    </TextContent>
                                </Col>
                                <Col xs={2}>
                                    <Votable
                                        votableModel={this.props.commentModel.votableModel}
                                    >
                                    </Votable>
                                </Col>
                            </Row>
                        </CardContent>
                    </Card>
                </Row>
            </Grid>
        )
    }
}


export default withStyles(styles)(Comment);