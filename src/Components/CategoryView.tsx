import * as React from 'react';
import '../Styles/icon.css';
import '../Styles/text.css';
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import {ChangeEvent} from "react";
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { ChangeCategoryActionCreator} from '../Actions/ChangeCategory';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppStore from '../Reducers/AppStore';
import CategoryModel from '../Models/CategoryModel';
import { TogglePostDetailsModeActionCreator } from '../Actions/TogglePostDetailsMode';

interface CategoryViewProps extends RouteComponentProps<any> {
    category: CategoryModel;
}

interface CategoryViewDispatchProps {
    dispatch: any;
}

interface CategoryViewStoreProps {
    availableCategories: CategoryModel[];
}

interface CategoryViewAllProps extends CategoryViewProps, CategoryViewDispatchProps, CategoryViewStoreProps {}

const mapDispatchToProps: MapDispatchToProps<CategoryViewDispatchProps, CategoryViewProps> = ((dispatch: any): CategoryViewDispatchProps => {
    return {
        dispatch: dispatch,
    }
});

const mapStateToProps: MapStateToProps<CategoryViewStoreProps, CategoryViewProps, AppStore> = ((state: AppStore): CategoryViewStoreProps => {
    return {
        availableCategories: state.availableCategories,
    }
});

class CategoryView extends React.Component<CategoryViewAllProps> {

    public handleCategoryChange = (event: ChangeEvent<HTMLInputElement>, value: number ) => {
        let category = getCategoryFromSelectValue(value, this.props.availableCategories);
        this.props.dispatch(ChangeCategoryActionCreator(category));
        this.props.dispatch(TogglePostDetailsModeActionCreator(false));
        this.props.history.push(`/${category.path}`);
    };

    render() {
        let indexOfCategory = this.props.availableCategories.findIndex((category: CategoryModel) => {
           return category.name === this.props.category.name && category.path === this.props.category.path;
        });

        return (
            <div>
                <AppBar position="static">
                    <Tabs value={indexOfCategory} onChange={this.handleCategoryChange}>
                        {this.props.availableCategories.map((value: CategoryModel) => {
                            return (
                                <Tab label={value.name} key={value.name}/>
                            )
                        })}
                    </Tabs>
                </AppBar>
        </div>
        )
    }
}

const getCategoryFromSelectValue = (value: number, availableCategories: CategoryModel[]): CategoryModel => {
    if (value > availableCategories.length) {
        throw new Error("Unknown Category!");
    }
    return availableCategories[value];
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryView));