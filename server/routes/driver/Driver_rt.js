const express = require('express');
const router = express.Router();
const DriverSchema = require('../../model/driver/Driver_md');

//////////// API Routes && Input Validation && Error Handling ////////////

// SAMPLE
// router.get('/XXXX', async (req, res) => {
//     try {
//         const tasks = await DriverSchema.find();
//         res.json(tasks);
//     } catch (err) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

module.exports = router;