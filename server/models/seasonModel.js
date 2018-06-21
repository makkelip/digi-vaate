export default (sequelize, DataTypes) => {
    const Season = sequelize.define('seasons', {
        name: {
            type: DataTypes.STRING,
        }
    });

    Season.associate = (models) => {
        Season.hasMany(models.Collection, {
            as: 'collections'
        });
    };
    return Season;
};

/*
const seasonSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, default: getDateTime()},
    budget: {type: Number, min: 0},
    taxPercent: {type: Number, min: 0, max: 100},
    collections: [{type: mongoose.Schema.Types.ObjectId, ref: 'Collection'}],
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

module.exports = mongoose.model('Season', seasonSchema);
*/
function getDateTime() {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    let day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + '-' + month + '-' + day;
}
