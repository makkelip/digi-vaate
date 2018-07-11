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
            include: [{all: true},
                {
                model: models.Season,
                as: 'seasons',
                include: [
                    {
                        model: models.Product,
                        as: 'products'
                    },{
                        model: models.Collection,
                        as: 'collections',
                        include: [{
                            model: models.Product,
                            as: 'products'
                        }]
                }]
            }]
        })
            .then(comp => {
                const products = [];
                comp.seasons.forEach(season => {
                    season.products.forEach(prod => {
                        products.push(prod);
                    });
                    season.collections.forEach(collection => {
                        collection.products.forEach(product => {
                            products.push(product);
                        });
                    });
                });
                comp.products.forEach(prod => {
                    products.push(prod);
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