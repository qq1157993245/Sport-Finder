import {QueryDocumentSnapshot} from 'firebase-admin/firestore';
import {logger} from 'firebase-functions';
import admin from 'firebase-admin';
import {onSchedule} from 'firebase-functions/v2/scheduler';


admin.initializeApp();


export const removeExpiredGames = onSchedule('every 1 hours', async () => {
  const db = admin.firestore();
  const now = new Date();

  const gamesRef = db.collection('coordinates');
  const expiredGames = await gamesRef.where('expiresAt', '<', now).get();

  const batch = db.batch();
  expiredGames.forEach((doc:QueryDocumentSnapshot) => batch.delete(doc.ref));

  await batch.commit();
  logger.log(`Deleted ${expiredGames.size} Expired Games`);
});

