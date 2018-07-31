import models from '../models/models';
import Controller from './Controller';
import ProductController from "./productController";

class SeasonController extends Controller {
    constructor() { super(models.Season); }

    setRelations(entity, jsonBody) {
        if (jsonBody.colors) entity.setColors(jsonBody.colors);
    }

    //populates with products
    getAllColors(req, res) {
        const properties = Controller.collectProperties(req.query, models.Season);
        if (properties.error) {
            res.status(500).json(properties);
            return;
        }
        models.Season.findOne({
            where: properties,
            include: [
                {
                    model: models.Color,
                    as: 'colors',
                    include: [
                        {
                            model: models.Product,
                            as: 'products',
                            attributes: ['name', 'id']
                        }
                    ]
                }
            ]
        })
            .then(ent => {
                const colors = [];
                ent.colors.forEach(color => colors.push(color));
                res.send(colors);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json(err);
            });
    }

    getAllProducts(req, res) {

        const properties = Controller.collectProperties(req.query, models.Season);
        if (properties.error) {
            res.status(500).json(properties);
            return;
        }
        models.Season.findOne({
            where: properties,
            include: [
                {
                    model: models.Product,
                    as: 'products',
                    include: [{all: true}],
                    separate: true,
                    order: [["name", "ASC"]],
                },
                {
                    model: models.Collection,
                    as: 'collections',
                    include: [{
                        model: models.Product,
                        as: 'products',
                        include: [{all: true}],
                        separate: true,
                        order: [["name", "ASC"]],
                }]
            }]
        })
            .then(season => {
                const products = [];
                season.collections.forEach(collection => {
                    collection.products.forEach(prod => {
                        prod.dataValues.seasonName = season.name;
                        prod.dataValues.collectionName = collection.name;
                        products.push(prod);
                    });
                });
                season.products.forEach(prod => {
                    prod.dataValues.seasonName = season.name;
                    products.push(prod);
                });
                products.forEach(product => ProductController.addMaterialCosts(product));
                res.send(products);
            })
            .catch(err => {
                console.error('Error finding all products: ' + err);
                res.status(500).json({ error: err });
            })
    }
}

export default new SeasonController();