const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
router.post('/checkout', borrowController.checkout);
router.get('/all-borrows', borrowController.getAllBorrows);
router.post('/return', borrowController.returnBook);

module.exports = router;