/* eslint-disable curly */
/* eslint-disable padded-blocks */
/* eslint-disable require-jsdoc */

import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

import * as GLOBAL_VARIABLES from "../environments/global_variables.config";
import * as VALIDATION_INTERCEPTOR from "../middleware/validators/ingress.validators";

import {
    getUserModel,
    getUsersModel,
    mapUser,
    updateUserPhoneModel,
    userCreationWithEmailModel,
} from "../middleware/interfaces/user.interfaces";
import {
    getUserSchema,
    getUsersSchema,
    updateUserPhoneSchema,
    userCreationWithEmailSchema,
} from "../middleware/schema/user.schema";
import { requestValidator } from "../middleware/validators/request.validator";
import {
    userAuthPasswordModel,
    userAuthRoleModel,
    userAuthUserModel,
} from "../middleware/interfaces/auth.interface";
import {
    userAuthPasswordSchema,
    userAuthRoleSchema,
    userAuthUserSchema,
} from "../middleware/schema/auth.schema";

export async function createUser(req: Request, res: Response, next: NextFunction) {

    try {

        const createUserPayload: userCreationWithEmailModel = {
            displayName: req.body.displayName,
            password: req.body.password,
            role: req.body.role,
            email: req.body.email,
            phone: req.body.phone,
        };

        return await requestValidator(createUserPayload, userCreationWithEmailSchema, res, next).then(async () => {

            if (res.headersSent) return;

            await admin.auth().createUser({
                displayName: createUserPayload.displayName,
                password: createUserPayload.password,
                email: createUserPayload.email,
                phoneNumber: createUserPayload.phone,
            }).then(async (userRecord) => {

                await admin.auth().setCustomUserClaims(userRecord.uid, {
                    role: createUserPayload.role,
                }).then(() => {

                    return res.status(201).send({
                        user_id: userRecord.uid,
                    });

                }).catch((error) => {
                    return res.status(400).send(error);
                });

            }).catch((error) => {
                return res.status(400).send(error);
            });

        });

    } catch (err) {
        return handleError(res, err);
    }

}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {

    try {

        const usersDataDocumentArray: unknown[] = [];

        const getUsersParams: getUsersModel = {
            startNumber: Number(req.query.startNumber),
            pageSize: Number(req.query.pageSize),
        };

        return await requestValidator(getUsersParams, getUsersSchema, res, next).then(async () => {

            if (res.headersSent) return;

            await returnAllUsers(usersDataDocumentArray, res, getUsersParams.startNumber || 0, getUsersParams.pageSize || 10).then((result) => {
                return res.status(200).send({
                    data: result.usersDataDocumentArray,
                    max_count: result.maxCount,
                });
            }).catch((error) => {
                return res.status(400).send(error);
            });
        });

    } catch (err) {
        return handleError(res, err);
    }

}

export async function getUser(req: Request, res: Response, next: NextFunction) {

    try {

        const getUserInput: getUserModel = {
            id: req.params.id,
        };

        return await requestValidator(getUserInput, getUserSchema, res, next).then(async () => {

            if (res.headersSent) return;
            await userExtractor("users", getUserInput.id, res);

        });

    } catch (err) {
        return handleError(res, err);
    }

}

export async function updateUserPhoneNumber(req: Request, res: Response, next: NextFunction) {

    try {

        const getUserInput: updateUserPhoneModel = {
            id: req.params.id,
            phone: req.body.phone,
        };

        return await requestValidator(getUserInput, updateUserPhoneSchema, res, next).then(async () => {

            if (res.headersSent) return;

            if (!VALIDATION_INTERCEPTOR.newPhoneReg.test(getUserInput.phone)) return res.status(400).send({
                message: "invalid phone",
            });

            return await GLOBAL_VARIABLES.setMana.collection("users").where("ID", "==", getUserInput.id).limit(1).get().then(async (queryUserSnapshot) => {

                if (queryUserSnapshot.empty) return res.status(404).send({
                    message: "no user found for id provided",
                });

                const userDocID = queryUserSnapshot.docs[0].id;

                return await admin.auth().updateUser(getUserInput.id, {
                    phoneNumber: getUserInput.phone,
                }).then(async (userRecord) => {

                    await GLOBAL_VARIABLES.setMana.collection("users").doc(userDocID).update({
                        phone: getUserInput.phone,
                    }).then(() => {

                        return res.status(200).send({
                            message: "user phone number updated successfully",
                            user_data: userRecord,
                        });

                    }).catch((error) => {
                        return res.status(400).send(error);
                    });

                }).catch((error) => {
                    return res.status(400).send(error);
                });


            }).catch((error) => {
                return res.status(400).send(error);
            });

        });

    } catch (err) {
        return handleError(res, err);
    }

}

export async function patchUserPassword(req: Request, res: Response, next: NextFunction) {

    try {

        const patchUserPasswordPayload: userAuthPasswordModel = ({
            id: req.params.id,
            password: req.body.password,
        });

        return await requestValidator(patchUserPasswordPayload, userAuthPasswordSchema, res, next).then(async () => {

            if (res.headersSent) return;

            if (!VALIDATION_INTERCEPTOR.passwordReg.test(patchUserPasswordPayload.password)) return res.status(400).send({
                message: "invalid password: put password validity pattern here",
            });

            return await admin.auth().updateUser(patchUserPasswordPayload.id, {
                password: patchUserPasswordPayload.password,
            }).then(async () => {

                await admin.auth().getUser(patchUserPasswordPayload.id).then((userRecord) => {

                    return res.status(200).send({
                        message: "Update successful",
                        user: mapUser(userRecord),
                    });

                }).catch((error) => {
                    return res.status(400).send({
                        message: error,
                    });
                });

            }).catch((error) => {
                return res.status(400).send({
                    message: error,
                });
            });

        });

    } catch (err) {
        return handleError(res, err);
    }

}

export async function patchUserRole(req: Request, res: Response, next: NextFunction) {

    try {

        const patchUserPasswordPayload: userAuthRoleModel = {
            id: req.params.id,
            role: req.body.role,
        };

        return await requestValidator(patchUserPasswordPayload, userAuthRoleSchema, res, next).then(async () => {

            if (res.headersSent) return;

            await admin.auth().setCustomUserClaims(patchUserPasswordPayload.id, {
                role: patchUserPasswordPayload.role,
            }).then(async () => {

                await admin.auth().getUser(patchUserPasswordPayload.id).then((userRecord) => {

                    return res.status(200).send({
                        message: "update successful",
                        user: mapUser(userRecord),
                    });

                });

            }).catch((error) => {
                return res.status(400).send({
                    message: error,
                });
            });

        });

    } catch (err) {
        return handleError(res, err);
    }

}

export async function removeUser(req: Request, res: Response, next: NextFunction) {

    try {

        const removeUserPayload: userAuthUserModel = {
            id: req.params.id,
        };

        return await requestValidator(removeUserPayload, userAuthUserSchema, res, next).then(async () => {

            if (res.headersSent) return;

            await admin.auth().deleteUser(removeUserPayload.id).then(() => {

                return res.status(200).send({
                    message: `user with ID: ${removeUserPayload.id} removed`,
                });

            }).catch((error) => {
                return res.status(400).send({
                    message: error,
                });
            });

        });

    } catch (err) {
        return handleError(res, err);
    }

}

async function userExtractor(useCollectionName: string, userID: string, res: Response) {

    await admin.auth().getUser(userID).then(async (userRecord) => {

        await GLOBAL_VARIABLES.setMana.collection(useCollectionName).where("ID", "==", userRecord.uid).get().then(async (querySnapshot) => {

            if (querySnapshot.empty) return res.status(400).send({
                message: "no user found",
            });

            const useDocumentID = querySnapshot.docs[0].id;
            return await GLOBAL_VARIABLES.setMana.collection(useCollectionName).doc(useDocumentID).get().then((userDocument) => {

                return res.status(200).send({
                    user_data: {
                        auth: mapUser(userRecord),
                        document: userDocument.data(),
                    },
                });

            }).catch((error) => {
                return res.status(400).send(error);
            });

        }).catch((error) => {
            return res.status(400).send(error);
        });

    }).catch((error) => {
        return res.status(400).send(error);
    });

}

async function returnAllUsers(usersDataDocumentArray: unknown[], res: Response, start: number, pageSize: number) {

    let maxCount = 0;
    await GLOBAL_VARIABLES.setMana.collection("users").get().then((snapshot: { size: number; }) => {
        maxCount = snapshot.size;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await GLOBAL_VARIABLES.setMana.collection("users").orderBy("createdAt").limit(pageSize).offset(start).get().then(async (querySnapshot: { empty: any; docs: any; }) => {

        if (querySnapshot.empty) return res.status(200).send({
            message: "no admin data found",
        });

        const docs = querySnapshot.docs;
        for (const doc of docs) {

            const selectedItem = {

                document_id: doc.id,
                userID: doc.data().ID,
                document: doc.data(),

            };

            usersDataDocumentArray.push(selectedItem);

        }

        return usersDataDocumentArray;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).catch((error: any) => {
        return res.status(400).send(error);
    });

    return ({ usersDataDocumentArray, maxCount });

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
