module.exports = (sequelize, DataTypes) => {
    //odoo attribute variants as comments
    const Order = sequelize.define('orders', {
        price: DataTypes.FLOAT, //amount_total - monetary
        status: DataTypes.STRING,
        deliveryCosts: DataTypes.FLOAT,
        taxPercent: DataTypes.FLOAT, //amount_tax - monetary
        supplier: DataTypes.STRING,
        vat: DataTypes.STRING,
        invoicingAddress: DataTypes.STRING,
        deliveryAddress: DataTypes.STRING,
        deliveryTime: DataTypes.DATE,
        deliveryTerms: DataTypes.STRING,
        paymentTerms: DataTypes.STRING,
        brandLabel: DataTypes.STRING,
        info: DataTypes.STRING
    });

    Order.associate = (models) => {
        Order.hasMany(models.OrderProduct, { as: 'orderProducts' });
    };

    return Order;
}