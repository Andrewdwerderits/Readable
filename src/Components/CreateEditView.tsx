// import * as React from 'react';
// import PostModel from '../Models/PostModel';
// import Votable from '../Components/Votable';
// import TextContent from '../Components/TextContent';
// import Card from '@material-ui/core/Card';
// import Typography from '@material-ui/core/Typography';
// import {Grid, Row, Col} from 'react-flexbox-grid';
//
// class CreateEditViewProps {
//     constructor (public postModel: PostModel,) {
//     }
// }
//
// /* tslint:disable */
// class CreateEditView extends React.Component<CreateEditViewProps, any>{
//     /* tslint:enable */
//
//     render() {
//         return (
//             <Grid fluid>
//                 <Row>
//                     <Card max-width='25%' bottom-margin='15px'>
//                         <Row>
//                             <Col xs={12} xsOffset={4}>
//                                 <Typography className='text'>{this.props.postModel.contentModel.title}</Typography>
//                             </Col>
//                         </Row>
//                         <Row>
//                             <Col xs={12}>
//                                 <Votable
//                                     votableModel={this.props.postModel.votableModel}
//                                 >
//                                 </Votable>
//                             </Col>
//                         </Row>
//                         <Row>
//                             <Col xs={12}>
//                                 <TextContent
//                                     contentModel={this.props.postModel.contentModel}
//                                 >
//                                 </TextContent>
//                             </Col>
//                         </Row>
//                         <Row>
//                             <Col xs={12} xsOffset={4}>
//                                 <Typography className='text'>See all {this.props.postModel.comments.length} comments</Typography>
//                             </Col>
//                         </Row>
//                     </Card>
//                 </Row>
//             </Grid>
//         )
//     }
// }
//
//
// export default CreateEditView;