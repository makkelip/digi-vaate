const express = require('express');
import SeasonController from '../controllers/seasonController';
const router = express.Router();

router.get('/', SeasonController.find_by_attribute);
router.get('/products', SeasonController.getAllProducts);
router.post('/', SeasonController.create);
router.patch('/', SeasonController.update);
router.delete('/', SeasonController.delete);

module.exports = router;
