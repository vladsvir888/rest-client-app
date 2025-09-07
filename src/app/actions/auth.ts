'use server';

import { commonErrMessage, tokenName } from '@/consts/firebase';
import { admin, auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { cookies } from 'next/headers';

export async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(tokenName);
    if (!token) return { authenticated: false };
    const decodedToken = await admin.auth().verifyIdToken(token.value);
    return { authenticated: !!decodedToken, userEmail: decodedToken.email };
  } catch {
    return { authenticated: false };
  }
}

export async function register(email: string, password: string) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const token = await res.user.getIdToken();
    const cookieStore = await cookies();
    cookieStore.set(tokenName, token);
    return true;
  } catch (err: unknown) {
    if (err instanceof FirebaseError) return { error: true, message: err.message };
    return { error: true, message: commonErrMessage };
  }
}

export async function login(email: string, password: string) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const token = await res.user.getIdToken();
    const cookieStore = await cookies();
    cookieStore.set(tokenName, token);
    return true;
  } catch (err: unknown) {
    if (err instanceof FirebaseError) return { error: true, message: err.message };
    return { error: true, message: commonErrMessage };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(tokenName);
    await signOut(auth);
  } catch (err: unknown) {
    if (err instanceof FirebaseError) return { error: true, message: err.message };
    return { error: true, message: commonErrMessage };
  }
}
