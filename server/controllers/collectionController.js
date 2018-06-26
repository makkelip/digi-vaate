import models from '../models/models';

exports.find_all = (req, res) => {
    models.Collection.findAll({ include: [{ all: true }] })
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.send({ error: err })
        });
};

exports.find_by_attribute = (req, res) => {
    const params = {};
    for(let attr in req.query) {
        if (attr in models.Collection.rawAttributes) {
            params[attr] = req.query[attr];
        } else {
            res.status(500).json({
                error: 'No attribute ' + attr + ' found'
            });
            return;
        }
    }
    models.Collection.findAll({
        where: params
    })
        .then(ent => {
            res.send(ent);
        })
        .catch(err => {
            console.error(err);
            res.stat(500).json(err);
        });
};

exports.find_by_id = (req, res) => {
    models.Collection.findById(req.params.id, { include: [{ all: true }] })
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.status(500).json({ error: err });
        });
};

exports.create = (req, res) => {
    models.Collection.create(req.body/* ,{
        include: [{
            model: models.Collection,
            as: 'collections'
        }]
    }*/
    )
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.status(500).json({ error: err });
        });
};

exports.update = (req, res) => {
    models.Season.findById(req.params.id)
        .then(ent => {
            ent.updateAttributes(req.body);
            res.send(ent);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.status(500).json({ error: err });
        });
};

exports.delete = (req, res) => {
    models.Collection.findById(req.params.id)
        .then(ent => {
            if (ent) {
                ent.destroy();
                res.send({status: 'deleted'});
            } else {
                res.status(500).json({
                    error: 'Not existing or already deleted'
                });
            }
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.status(500).json({ error: err });
        });
};
