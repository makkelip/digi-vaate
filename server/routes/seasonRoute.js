const express = require('express');
const SeasonController = require('../controllers/seasonController');
const router = express.Router();

router.get('/', SeasonController.find_all);
router.get('/:id', SeasonController.find_by_id);
router.post('/', SeasonController.create);
router.patch('/:id', SeasonController.edit);
router.delete('/:id', SeasonController.delete);

module.exports = router;