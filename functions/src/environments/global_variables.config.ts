import * as admin from "firebase-admin";

export const setMana = admin.firestore();
export const storageRef = admin.storage().bucket();
export const setManaAdmin = admin;
