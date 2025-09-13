'use server';

import { db } from '@/lib/firebase';
import { THistory } from '@/types/types';

export async function addHistory(data: THistory) {
  const collection = db.collection('history');

  try {
    await collection.add(data);
  } catch (err) {
    console.log(`addHistory: ${err}`);
  }
}

export async function getHistory() {
  const collection = db.collection('history');

  try {
    const querySnapshot = await collection.get();
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (err) {
    console.log(`getHistory: ${err}`);
  }
}
