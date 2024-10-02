const express = require('express');
const router = express.Router();
const RestaurantSchema = require('../../model/restaurant/Restaurant_md');

//////////// API Routes && Input Validation && Error Handling ////////////

// SAMPLE
// router.get('/XXXX', async (req, res) => {
//     try {
//         const tasks = await RestaurantSchema.find();
//         res.json(tasks);
//     } catch (err) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

module.exports = router;