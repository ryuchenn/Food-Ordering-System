const express = require('express');
const router = express.Router();
const OrderSchema = require('../../model/order/Order_md');

//////////// API Routes && Input Validation && Error Handling ////////////


// SAMPLE
// router.get('/XXXX', async (req, res) => {
//     try {
//         const tasks = await OrderSchema.find();
//         res.json(tasks);
//     } catch (err) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });



module.exports = router;