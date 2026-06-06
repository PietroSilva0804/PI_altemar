
'use client';

import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface UserPreferences {
  language: string;
  region: string;
  highContrast: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'pt-BR',
  region: 'BR',
  highContrast: false,
  fontSize: 16,
};

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  try {
    const docRef = doc(db, 'userPreferences', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...DEFAULT_PREFERENCES, ...docSnap.data() } as UserPreferences;
    } else {
      // Se não existir, criamos com os padrões
      await setDoc(docRef, {
        ...DEFAULT_PREFERENCES,
        lastUpdated: serverTimestamp(),
      });
      return DEFAULT_PREFERENCES;
    }
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

export async function updateUserPreference(
  userId: string,
  updates: Partial<UserPreferences>
) {
  try {
    const docRef = doc(db, 'userPreferences', userId);
    await setDoc(
      docRef,
      {
        ...updates,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
}
