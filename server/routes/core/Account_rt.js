const express = require('express');
const router = express.Router();
const AccountSchema = require('../../model/core/Account_md');

//////////// API Routes && Input Validation && Error Handling ////////////

// SAMPLE
// router.get('/XXXX', async (req, res) => {
//     try {
//         const tasks = await AccountSchema.find();
//         res.json(tasks);
//     } catch (err) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

module.exports = router;