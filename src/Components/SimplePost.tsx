import * as React from 'react';
import PostModel from '../Models/PostModel';
import Votable from '../Components/Votable';
import TextContent from '../Components/TextContent';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import CardHeader from '@material-ui/core/CardHeader';
// import Typography from '@material-ui/core/Typography';
import {Grid, Row, Col} from 'react-flexbox-grid';
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import { RouteComponentProps, withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import Button from '@material-ui/core/Button';
import EContentType from '../Enums/EContentType';
import EContentField from '../Enums/EContentField';

const styles = {
    expandText: {
        marginTop: 50,
    },
};

interface SimplePostProps extends RouteComponentProps<any> {
     postModel: PostModel;
     isEditing: boolean;
     isExpanded: boolean;
}

interface SimplePostDispatchProps {
    editPost(): void;
}

const mapDispatchToProps = ((dispatch: any, ownProps: SimplePostProps): SimplePostDispatchProps => {
    return {

        editPost: (() => {
            ownProps.history.push(`/edit/${ownProps.postModel.id}`);
        })
    }
});

/* tslint:disable */
class SimplePost extends React.Component<SimplePostProps & SimplePostDispatchProps & WithStyles<'expandText'>, any>{
/* tslint:enable */

    render() {

        return (
            <Grid fluid>
                    <TextContent
                        id={this.props.postModel.id}
                        postType={EContentType.post}
                        fieldType={EContentField.title}
                        parentPost={this.props.postModel}
                        body={this.props.postModel.contentModel.title}
                        extraText={""}
                        isEditing={this.props.isEditing}>
                    </TextContent>
                <Row>
                    <Card>
                        <CardContent>
                            <Row>
                                <Col xs={6} xsOffset={0}>
                                    <TextContent
                                        id={this.props.postModel.id}
                                        postType={EContentType.post}
                                        fieldType={EContentField.author}
                                        parentPost={this.props.postModel}
                                        body={this.props.postModel.contentModel.author}
                                        extraText={"Author: "}
                                        isEditing={this.props.isEditing}
                                    >
                                    </TextContent>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6}>
                                    <TextContent
                                        id={this.props.postModel.id}
                                        postType={EContentType.post}
                                        fieldType={EContentField.body}
                                        parentPost={this.props.postModel}
                                        body={this.props.postModel.contentModel.body}
                                        extraText={""}
                                        isEditing={this.props.isEditing}
                                    >
                                    </TextContent>
                                </Col>
                                <Col xs={2}>
                                    <Votable votableModel={this.props.postModel.votableModel} />
                                </Col>
                            </Row>
                            <Row>
                                {getExpandButton(this.props.isExpanded, this.props.editPost, this.props.postModel.comments.length)}
                            </Row>
                        </CardContent>
                    </Card>
                </Row>
            </Grid>
        )
    }
}

const getExpandButton = (isExpanded: boolean, editPost: () => void, commentCount: number) => {
    if (!isExpanded) {
        return (
            <Col xs={8} xsOffset={1}>
                <Button color='primary'
                    onClick={editPost}>See all {commentCount} comments
                </Button>
            </Col>
        );
    }
    return;
};


export default withRouter(connect(
        null,
        mapDispatchToProps,
    )(withStyles(styles)(SimplePost)));