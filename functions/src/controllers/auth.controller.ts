/* eslint-disable curly */
/* eslint-disable padded-blocks */
/* eslint-disable require-jsdoc */

import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

import axios, { AxiosError } from "axios";

import * as ENVIRONMENT_VARIABLES from "../environments/dev.config";
import * as INGRESS_VALIDATOR from "../middleware/validators/ingress.validators";

import {
    customTokenModel,
    emailPasswordSignInModel,
    iDTokensModel,
    reAuthenticationModel,
} from "../middleware/interfaces/auth.interface";
import { requestValidator } from "../middleware/validators/request.validator";
import {
    customTokenSchema,
    emailPasswordSignInSchema,
    iDTokensSchema,
    reAuthenticationSchema,
} from "../middleware/schema/auth.schema";

export async function signUserInWithEmailPassword(req: Request, res: Response, next: NextFunction) {

    try {

        const uri: string = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + ENVIRONMENT_VARIABLES.API_KEY_VALUE;
        const emailPasswordSignInPayload: emailPasswordSignInModel = req.body;

        return await requestValidator(emailPasswordSignInPayload, emailPasswordSignInSchema, res, next).then(async () => {

            if (res.headersSent) return;

            if (!INGRESS_VALIDATOR.emailReg.test(emailPasswordSignInPayload.email)) return res.status(400).send({
                message: "invalid email address",
            });

            if (!INGRESS_VALIDATOR.passwordReg.test(emailPasswordSignInPayload.password)) return res.status(400).send({
                message: "invalid password: put password validity pattern here",
            });

            return await axios.post(uri, {

                email: emailPasswordSignInPayload.email,
                password: emailPasswordSignInPayload.password,
                returnSecureToken: true,

            }).then(async (signInResponse) => {

                const userID: string = signInResponse.data.localId;
                await admin.auth().getUser(userID).then(async (userRecord) => {

                    return res.status(201).send({
                        response: signInResponse.data,
                        user_data: userRecord,
                    });

                }).catch((error) => {
                    return res.status(400).send(error);
                });

            }).catch((error) => {
                return res.status(400).send({
                    message: error,
                });
            });

        });

    } catch (error) {
        const err = error as AxiosError;
        return res.status(400).send(err.response?.data);
    }

}

export async function GETIdTokens(req: Request, res: Response, next: NextFunction) {

    try {

        const uri: string = ENVIRONMENT_VARIABLES.IDENTITY_TOOLKIT_BASE_URL + ENVIRONMENT_VARIABLES.CUSTOM_TOKEN_KEYHOLDER + ENVIRONMENT_VARIABLES.API_KEY_VALUE;
        const iDTokensPayload: iDTokensModel = req.body;

        return await requestValidator(iDTokensPayload, iDTokensSchema, res, next).then(async () => {

            if (res.headersSent) return;

            await axios.post(uri, {

                token: iDTokensPayload.token,
                returnSecureToken: true,

            }).then((signInResponse) => {
                return res.status(201).send(signInResponse.data);
            }).catch((error) => {
                const err = error as AxiosError;
                return res.status(400).send(err);
            });

        });

    } catch (err) {
        return handleError(res, err);
    }

}

export async function reAuthenticate(req: Request, res: Response, next: NextFunction) {

    try {

        const reAuthenticatePayload: reAuthenticationModel = req.body;
        const uri: string = ENVIRONMENT_VARIABLES.SECURE_API_BASE_URL + ENVIRONMENT_VARIABLES.SECURE_API_KEYHOLDER + ENVIRONMENT_VARIABLES.API_KEY_VALUE;

        return await requestValidator(reAuthenticatePayload, reAuthenticationSchema, res, next).then(async () => {

            if (res.headersSent) return;

            await axios.post(uri, {

                grant_type: "refresh_token",
                refresh_token: reAuthenticatePayload.refresh_token,

            }).then((reAuthResponse) => {
                return res.status(201).send(reAuthResponse.data);
            }).catch((error) => {
                const err = error as AxiosError;
                return res.status(400).send(err);
            });

        });

    } catch (err) {
        return handleError(res, err);
    }

}

export async function GETCustomToken(req: Request, res: Response, next: NextFunction) {

    try {

        const customTokenPayload: customTokenModel = req.body;

        return await requestValidator(customTokenPayload, customTokenSchema, res, next).then(async () => {

            if (res.headersSent) return;

            admin.auth().createCustomToken(customTokenPayload.uid).then((customToken) => {

                return res.status(201).send({
                    custom_token: customToken,
                });

            }).catch((error) => {
                return res.status(400).send(error);
            });

        });

    } catch (err) {
        return handleError(res, err);
    }

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
