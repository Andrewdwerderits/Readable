import CategoryModel from '../Models/CategoryModel';

class CategoryModelMapper {

    public static entityToBusiness = (entity: any): CategoryModel => {

        if (typeof(entity) === 'string') {
            let model = new CategoryModel("", "");
            model.name = entity;
            model.path = entity;
            return model;
        }

        let model = new CategoryModel("", "");
        model.name = entity.name;
        model.path = entity.path;
        return model;
    }
}

export default CategoryModelMapper;