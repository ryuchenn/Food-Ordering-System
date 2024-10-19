
const cron = require('node-cron');
const Session = require('../model/session_md');

/** Clear the Account & Session in ceratin hour
 * 
 */
async function ClearSession(){
    const now = new Date();

    const expiredSessions = await Session.find({ ExpireAt: { $lt: now } });
    const expiredSessionIds = expiredSessions.map(session => session._id);

    if (expiredSessionIds.length > 0) {
        const deletedAccounts = await Account.deleteMany({ SessionID: { $in: expiredSessionIds } });
        console.log(`${deletedAccounts.deletedCount} accounts related to expired sessions deleted.`);

        const deletedSessions = await Session.deleteMany({ _id: { $in: expiredSessionIds } });
        console.log(`${deletedSessions.deletedCount} expired sessions deleted.`);
    } else {
        console.log('No expired sessions found.');
    }
    // const result = await Session.deleteMany({ ExpireAt: { $lt: now } });

}

// Set the timer to delete the daily session (every 0:00 AM)
const cleanUpExpiredSessions1 = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
        await ClearSession();
    } catch (error) {
      console.error('Error deleting expired sessions:', error);
    }
  });
};

// Clear the session every three hours
const cleanUpExpiredSessions2 = async() => {
      const now = new Date();
      try {
        console.log(`==== Timer Mission: ${now} deleted the expired sessions per three hours . ===`);

        await ClearSession();
      } catch (error) {
        console.error('Error deleting expired sessions:', error);
      }
  };

module.exports = {cleanUpExpiredSessions1, cleanUpExpiredSessions2};
