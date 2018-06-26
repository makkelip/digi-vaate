import models from '../models/models';

exports.find_all = (req, res) => {
    models.Season.findAll({ include: [{ all: true }] })
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.send({ error: err })
        });
};

exports.find_by_id = (req, res) => {
    models.Season.findById(req.params.id, { include: [{ all: true }] })
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error('Error: ' + err);
            res.status(500).json({ error: err });
        });
};

exports.find_by_attribute = (req, res) => {
    const params = {};
    for(let attr in req.query) {
        if (attr in models.Season.rawAttributes) {
            params[attr] = req.query[attr];
        } else {
            res.status(500).json({
                error: 'No attribute ' + attr + ' found'
            });
            return;
        }
    }
    models.Season.findAll({
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

exports.create = (req, res) => {
    models.Season.create(req.body, {
        include: [{
            model: models.Collection,
            as: 'collections'
        }]
    })
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
    models.Season.findById(req.params.id)
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
