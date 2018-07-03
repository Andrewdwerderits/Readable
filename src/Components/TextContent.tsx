import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { Row, Col } from 'react-flexbox-grid';
import '../Styles/icon.css';
import '../Styles/text.css';
import { connect } from "react-redux";
import {ChangeEvent} from "react";
import { RouteComponentProps, withRouter} from 'react-router-dom';
import EContentField from '../Enums/EContentField';

interface TextContentProps extends RouteComponentProps<any> {
    fieldType: EContentField;
    body: string;
    isEditing: boolean;
    extraText: string;
    handleTextChange: (value: string, field: EContentField) => void;
}

interface TextContentAllProps extends TextContentProps {}

class TextContent extends React.Component<TextContentAllProps> {

    public handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        let val = event.target.value;
        this.props.handleTextChange(val, this.props.fieldType);
    };

    render() {

        if (this.props.fieldType === EContentField.body) {
            return (
                <Row>
                    <Col xs>
                        <TextField
                            name='textField'
                            fullWidth
                            onChange={this.handleTextChange}
                            disabled={!this.props.isEditing}
                            multiline
                            className='text'
                            value={this.props.body}>
                        </TextField>
                    </Col>
                </Row>
            )
        } else {
            return (
                <Row>
                    <Col xs={1}>
                        {this.props.extraText}
                    </Col>
                    <Col xs={8} xsOffset={1}>
                        <TextField
                            name='textField'
                            fullWidth
                            onChange={this.handleTextChange}
                            disabled={!this.props.isEditing}
                            multiline
                            className='text'
                            value={this.props.body}>
                        </TextField>
                    </Col>
                </Row>
            );
        }
    }
}

export default withRouter(connect(
    null,
    null
)(TextContent));