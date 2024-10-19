const mongoose = require('mongoose');
/** 
 * Session Schema
 * @param {ObjectId} AccountID - References Account._id; 
 * @param {string} SessionToken - Random String
 * @param {string} TableName - TableName
 * @param {date} CreateAt - Account creation date
 * @param {date} ExpireAt - Account creation date +150mins
 */
const SessionSchema = new mongoose.Schema({
    AccountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        default: null,
    },
    SessionToken: {
        type: String,
        required: true,
    },
    TableName: {
        type: String,
        required: true,
    },
    CreateAt: {
        type: Date,
        required: true,
        default: new Date(),
    },
    ExpireAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 2.5 * 60 * 60 * 1000),  // CreateAt Date + 150 mins
    },
});

module.exports = mongoose.model('Session', SessionSchema, 'Session');
