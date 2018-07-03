import * as React from 'react';
import PostModel from '../Models/PostModel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import { RouteComponentProps, withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import Button from '@material-ui/core/Button';
import ContentContainer from '../Components/ContentContainer';

const styles = {
    expandText: {
        marginTop: 50,
    },
};

interface SimplePostProps extends RouteComponentProps<any> {
     postModel: PostModel;
     isExpanded: boolean;
}

interface SimplePostAllProps extends SimplePostProps, WithStyles<'expandText'> {}

/* tslint:disable */
class SimplePost extends React.Component<SimplePostAllProps>{
/* tslint:enable */

    public goToPostDetail = (() => {
        this.props.history.push(`/${this.props.postModel.category.path}/${this.props.postModel.id}`);
    });

    render() {

        return (
            <Grid fluid>
                <Row>
                    <Card>
                        <CardContent>
                            <ContentContainer
                                model={this.props.postModel}>
                            </ContentContainer>
                            <Row>
                                {getExpandButton(this.props.isExpanded, this.goToPostDetail, this.props.postModel.comments.length)}
                            </Row>
                        </CardContent>
                    </Card>
                </Row>
            </Grid>
        )
    }
}

const getExpandButton = (isExpanded: boolean, goToPostDetail: () => void, commentCount: number) => {
    if (!isExpanded) {
        return (
            <Col xs={8} xsOffset={1}>
                <Button color='primary'
                    onClick={goToPostDetail}>See all {commentCount} comments
                </Button>
            </Col>
        );
    }
    return;
};


export default withRouter(connect(
        null,
        null,
    )(withStyles(styles)(SimplePost)));