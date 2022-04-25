const express = require('express');
const { getAllProductsStatic, getAllProducts } = require('../controllers/productsController');
const router = express.Router();


router.get('/', getAllProducts)
router.get('/static', getAllProductsStatic)

module.exports = router;
