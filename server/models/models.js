const Sequelize = require("sequelize");

const config = {
    database: 'digivaate',
    username: 'digivaate',
    password: 'digivaate',
    options: {
        host: process.env.DATABASE_URL || 'localhost',
        dialect: 'postgres',
        operatorsAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        // disable logging; default: console.log
        logging: false
    }
};

function modifyName(string) {
    return string.charAt(0).toUpperCase() + string.slice(1, string.length - 1);
}

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config.options
);

let models = {
    MaterialProduct: sequelize.define('material_product', {
        consumption: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        }
    }),
    OrderProductSize: sequelize.define('orderProduct_size', {
        amount:{
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    })
};

let modules = [
    require('./materialModel'),
    require('./companyModel'),
    require('./colorModel'),
    require('./productModel'),
    require('./collectionModel'),
    require('./seasonModel'),
    require('./themeModel'),
    require('./sizeModel'),
    require('./orderModel'),
    require('./orderProductModel')
];

modules.forEach(module => {
    const model = module(sequelize, Sequelize);
    if (model.name === 'companies') {
        models['Company'] = model;
    } else {
        models[modifyName(model.name)] = model;
    }
});

Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
module.exports = models;

