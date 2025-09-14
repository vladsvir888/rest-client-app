'use server';

import { db } from '@/lib/firebase';
import { THistory } from '@/types/types';
import { checkAuth } from './auth';

export async function addHistory(data: THistory) {
  const { userEmail } = await checkAuth();
  const collection = db.collection('history');

  try {
    await collection.add({ ...data, userEmail });
  } catch (err) {
    console.log(`addHistory: ${err}`);
  }
}

export async function getHistory() {
  const { userEmail } = await checkAuth();
  const collection = db.collection('history');

  try {
    const querySnapshot = await collection.where('userEmail', '==', userEmail).get();
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (err) {
    console.log(`getHistory: ${err}`);
  }
}
