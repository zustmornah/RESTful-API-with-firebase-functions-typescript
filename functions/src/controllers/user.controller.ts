import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

function IsValidString(niceString: string): boolean {
    return typeof niceString === 'string';
}

/* function IsValidNumber(jumpyNumber: number): boolean {
    return typeof jumpyNumber === 'number';
}

function IsValidBoolean(bipolarGuy: boolean): boolean {
    return typeof bipolarGuy === 'boolean';
} */

const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const phoneReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

function mapUser(user: admin.auth.UserRecord) {

    const customClaims = (user.customClaims || { role: "" }) as {
        role?: string;
    };
    const role = customClaims.role ? customClaims.role : "";

    return {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        role,
        phone: user.phoneNumber,
        lastSignInTime: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime,
        photoURL: user.photoURL
    };

}

export async function createUser(req: Request, res: Response, next: NextFunction) {

    try {

        const { displayName, password, email, role, phone } = req.body;
        let validated: boolean = true;

        if (!displayName) {
            validated = false;
            return res.status(400).send({
                message: "missing displayName"
            });
        }

        if (!IsValidString(displayName)) {
            validated = false;
            return res.status(400).send({
                message: "invalid displayName field, displayName must be a string"
            });
        }

        if (!password) {
            validated = false;
            return res.status(400).send({
                message: "missing password"
            });
        }

        if (!passwordReg.test(password)) {
            validated = false;
            res.status(400).send({
                message: "password should contains at least one upper case letter, one lower case letter, one digit, a symbol and 8 characters"
            });
        }

        if (!email) {
            validated = false;
            return res.status(400).send({
                message: "missing email"
            });
        }

        if (!emailReg.test(email)) {
            validated = false;
            res.status(400).send({
                message: "invalid email"
            });
        }

        if (!role) {
            return res.status(400).send({
                message: "missing role"
            });
        }

        if (!IsValidString(role)) {
            validated = false;
            return res.status(400).send({
                message: "invalid role field, role must be a string"
            });
        }

        if (!phone) {
            validated = false;
            return res.status(400).send({
                message: "missing phone"
            });
        }

        if (!phoneReg.test(phone)) {
            validated = false;
            res.status(400).send({
                message: "invalid phone number"
            });
        }

        if (validated) {

            await admin.auth().createUser({
                displayName: displayName,
                password: password,
                email: email,
                phoneNumber: phone
            }).then(async (userRecord) => {

                await admin.auth().setCustomUserClaims(userRecord.uid, {
                    role: role
                }).then(() => {

                    return res.status(201).send({
                        user_id: userRecord.uid
                    });

                }).catch((error) => {
                    return res.status(400).send({
                        message: error
                    });
                });

            }).catch((error) => {
                return res.status(400).send({
                    message: error
                });
            });

        } else {
            return res.status(400).send({
                message: 'there are validation errors, check request payload'
            });
        }

        return;

    } catch (err) {
        return handleError(res, err);
    }

}

export async function getUsers(req: Request, res: Response, next: NextFunction) {

    try {

        await admin.auth().listUsers().then((listUsers) => {

            const users = listUsers.users.map(mapUser);
            return res.status(200).send({
                users
            });

        }).catch((error) => {
            return res.status(400).send({
                message: error
            });
        });

        return;

    } catch (err) {
        return handleError(res, err);
    }

}

export async function getUser(req: Request, res: Response, next: NextFunction) {

    try {

        const { id } = req.params;
        let validated: boolean = true;

        if (!id) {
            validated = false;
            return res.status(400).send({
                message: "no user ID in url param"
            });
        }

        if (validated) {

            await admin.auth().getUser(id).then((userRecord) => {

                return res.status(200).send({
                    user: mapUser(userRecord)
                });

            }).catch((error) => {
                return res.status(400).send({
                    message: error
                });
            });

        } else {
            return res.status(400).send({
                message: "there were validation error(s), check request payload"
            });
        }

        return;

    } catch (err) {
        return handleError(res, err);
    }

}

export async function patchUser(req: Request, res: Response, next: NextFunction) {

    try {

        const { id } = req.params;
        const { displayName, phone, email, photoURL } = req.body;
        let validated: boolean = true;

        if (!id) {
            validated = false;
            return res.status(400).send({
                message: "no user ID in url param"
            });
        }

        if (!displayName) {
            validated = false;
            return res.status(400).send({
                message: "missing displayName"
            });
        }

        if (!IsValidString(displayName)) {
            validated = false;
            return res.status(400).send({
                message: "invalid displayName field, displayName must be a string"
            });
        }

        if (!phone) {
            validated = false;
            return res.status(400).send({
                message: "missing phone field"
            });
        }

        if (!phoneReg.test(phone)) {
            validated = false;
            res.status(400).send({
                message: "invalid phone number"
            });
        }

        if (!email) {
            validated = false;
            return res.status(400).send({
                message: "missing email"
            });
        }

        if (!emailReg.test(email)) {
            validated = false;
            res.status(400).send({
                message: "invalid email"
            });
        }

        if (!photoURL) {
            validated = false;
            return res.status(400).send({
                message: "missing photoURL"
            });
        }

        if (!IsValidString(photoURL)) {
            validated = false;
            return res.status(400).send({
                message: "invalid photoURL field, photoURL must be a string"
            });
        }

        if (validated) {

            await admin.auth().updateUser(id, {

                displayName: displayName,
                phoneNumber: phone,
                email: email,
                photoURL: photoURL

            }).then(async () => {

                await admin.auth().getUser(id).then((userRecord) => {

                    return res.status(200).send({
                        message: "user updated",
                        user: mapUser(userRecord)
                    });

                }).catch((error) => {
                    return res.status(400).send({
                        message: error
                    });
                });

            }).catch((error) => {
                return res.status(400).send({
                    message: error
                });
            });

        } else {
            return res.status(400).send({
                message: "there were validation error(s), check request payload"
            });
        }

        return;

    } catch (err) {
        return handleError(res, err);
    }

}

export async function patchUserPassword(req: Request, res: Response, next: NextFunction) {

    try {

        const { id } = req.params;
        const { password } = req.body;
        let validated: boolean = true;

        if (!id) {
            validated = false;
            return res.status(400).send({
                message: "no user ID in url param"
            });
        }

        if (!password) {
            validated = false;
            return res.status(400).send({
                message: "missing password"
            });
        }

        if (!passwordReg.test(password)) {
            validated = false;
            res.status(400).send({
                message: "password should contains at least one upper case letter, one lower case letter, one digit, a symbol and 8 characters"
            });
        }

        if (validated) {

            await admin.auth().updateUser(id, {
                password: password
            }).then(async () => {

                await admin.auth().getUser(id).then((userRecord) => {

                    return res.status(200).send({
                        message: "Update Successful",
                        user: mapUser(userRecord)
                    });

                }).catch((error) => {
                    return res.status(400).send({
                        message: error
                    });
                });

            }).catch((error) => {
                return res.status(400).send({
                    message: error
                });
            });

        } else {
            return res.status(400).send({
                message: "there were validation error(s), check request payload"
            });
        }

        return;

    } catch (err) {
        return handleError(res, err);
    }

}

export async function patchUserRole(req: Request, res: Response, next: NextFunction) {

    try {

        const { id } = req.params;
        const { role } = req.body;
        let validated: boolean = true;

        if (!id) {
            validated = false;
            return res.status(400).send({
                message: "no user ID in url param"
            });
        }

        if (!role) {
            validated = false;
            return res.status(400).send({
                message: "no user role specified in request body"
            });
        }

        if (!IsValidString(role)) {
            validated = false;
            return res.status(400).send({
                message: "invalid role field, role must be a string"
            });
        }

        if (validated) {

            await admin.auth().setCustomUserClaims(id, {
                role: role
            }).then(async () => {

                await admin.auth().getUser(id).then((userRecord) => {

                    return res.status(200).send({
                        message: "update successful",
                        user: mapUser(userRecord)
                    });

                });

            }).catch((error) => {
                return res.status(400).send({
                    message: error
                });
            });

        } else {
            return res.status(400).send({
                message: "there were validation error(s), check request payload"
            });
        }

        return;

    } catch (err) {
        return handleError(res, err);
    }

}

export async function removeUser(req: Request, res: Response, next: NextFunction) {

    try {

        const { id } = req.params;
        let validated: boolean = true;

        if (!id) {
            validated = false;
            return res.status(400).send({
                message: "no user ID in url param"
            });
        }

        if (validated) {

            await admin.auth().deleteUser(id).then(() => {

                return res.status(200).send({
                    message: `user with ID: ${id} removed`
                });

            }).catch((error) => {
                return res.status(400).send({
                    message: error
                });
            });

        } else {
            return res.status(400).send({
                message: "there were validation error(s), check request payload"
            });
        }

        return;

    } catch (err) {
        return handleError(res, err);
    }

}

function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
