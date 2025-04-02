import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const removeExpiredGames = functions.pubsub
  .schedule('every 1 hours')
  .timeZone('UTC')
  .onRun(async () => {
    const db = admin.firestore();
    const now = new Date();

    const snapshot = await db.collection('gamesTime').get();

    if (snapshot.empty) {
      console.log('No games found.');
      return null;
    }

    const batch = db.batch();
    let deleteCount = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const endTime = new Date(data.endTime);
      const hour = typeof data.hour === 'number' ? data.hour : null;

      if (!endTime || hour == null) return;

      if (endTime.getTime() < now.getTime()) {
        batch.delete(doc.ref);
        deleteCount++;
      }
    });

    if (deleteCount > 0) {
      await batch.commit();
    }

    console.log(`Deleted ${deleteCount} expired games.`);
    return null;
  });