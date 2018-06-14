import Material from '../models/materialModel';
import mongoose from 'mongoose';

exports.find_all = (req, res) => {
    Material.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
};


exports.find_by_id = (req, res) => {
    Material.findById(req.params.id)
        .exec()
        .then(doc => {
            console.log('From database', doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: 'No valid entry found'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
};

exports.create = (req, res) => {
    const material = new Material({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        weight: req.body.weight,
        width: req.body.width,
        price: req.body.price,
        minQuantity: req.body.minQuantity,
        freight: req.body.freight,
        instructions: req.body.instructions,
        manufacturer: req.body.manufacturer,
        salesAgent: req.body.salesAgent,
        pattern: req.body.pattern,
        composition: req.body.composition,
        colors: req.body.colors
    });
    material.save()
        .then(result => {
            res.status(201).json({
                message: 'Collection stored',
                created: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Create failed',
                error: err
            });
        });
};

exports.edit = (req, res) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propertyName] = ops.value;
    }
    Material.update({ _id: id }, { $set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Material.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};
