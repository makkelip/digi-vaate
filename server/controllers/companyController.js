import models from '../models/models';
import Controller from './Controller';

class CompanyController extends Controller {
    constructor() { super(models.Company); }

    getAllProducts(req, res) {
        const properties = Controller.collectProperties(req.query, models.Company);
        if (properties.error) {
            res.status(500).json(properties);
            return;
        }
        models.Company.findOne({
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
                model: models.Season,
                as: 'seasons',
                include: [
                    {
                        model: models.Product,
                        as: 'products',
                        include: [{all: true}],
                        separate: true,
                        order: [["name", "ASC"]],
                    },{
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
            }]
        })
            .then(comp => {
                const products = [];
                comp.products.forEach(prod => {
                    products.push(prod);
                });
                comp.seasons.forEach(season => {
                    season.products.forEach(prod => {
                        prod.dataValues.seasonName = season.name;
                        products.push(prod);
                    });
                    season.collections.forEach(collection => {
                        collection.products.forEach(prod => {
                            prod.dataValues.seasonName = season.name;
                            prod.dataValues.collectionName = collection.name;
                            products.push(prod);
                        });
                    });
                });
                res.send(products);
            })
            .catch(err => {
                console.error(err);
                res.send(err);
            });
    }
}

export default new CompanyController();