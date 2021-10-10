import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

import axios, { AxiosError } from 'axios';

import * as keys from '../environments/dev.config.json';
const keyPairs = {
    API_KEY: keys.WebAPI_KEY
}

function IsValidString(niceString: string): boolean {
    return typeof niceString === 'string';
}

export async function signUserIn(req: Request, res: Response, next: NextFunction) {

    try {

        const { password, email } = req.body;
        const uri: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + keyPairs.API_KEY;
        let validated: boolean = true;

        if (!password) {
            return res.status(400).send({
                message: "missing password field, password field is required"
            });
        }

        if (!IsValidString(password)) {
            validated = false;
            return res.status(400).send({
                message: "invalid password field, password must be a string"
            });
        }

        if (!email) {
            validated = false;
            return res.status(400).send({
                message: "missing email field, email field is required"
            });
        }

        if (validated) {

            await axios.post(uri, {

                email: email,
                password: password,
                returnSecureToken: true

            }).then((response) => {
                return res.status(201).send(response.data);
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

    } catch (err) {

        const error = err as AxiosError;
        res.status(400).send(error);

    }

    return undefined;

}

export async function reAuthenticate(req: Request, res: Response, next: NextFunction) {

    try {

        const { refresh_token } = req.body;
        const uri: string = 'https://securetoken.googleapis.com/v1/token?key=' + keyPairs.API_KEY;
        let validated: boolean = true;

        if (!refresh_token) {
            validated = false;
            return res.status(400).send({
                message: "missing refresh_token field"
            });
        }

        if (validated) {

            await axios.post(uri, {

                grant_type: "refresh_token",
                refresh_token: refresh_token

            }).then((response) => {
                return res.status(201).send(response.data);
            }).catch((error) => {
                return res.status(400).send({ message: error });
            });

        } else {
            return res.status(400).send({
                message: "there were validation error(s), check request payload"
            });
        }

    } catch (err) {

        const error = err as AxiosError;
        res.status(400).send({ message: error });

    }

    return undefined;

}

export async function GETCustomToken(req: Request, res: Response, next: NextFunction) {

    try {

        const { uid } = req.body;
        let validated: boolean = true;

        if (!uid) {
            validated = false;
            return res.status(400).send({ message: "missing uid" });
        }

        if (validated) {

            admin.auth().createCustomToken(uid).then((customToken) => {

                return res.status(201).send({
                    message: customToken
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

    } catch (err) {
        return handleError(res, err);
    }

    return undefined;

}

export async function GETIdTokens(req: Request, res: Response, next: NextFunction) {

    try {

        const { token } = req.body;
        const uri: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' + keyPairs.API_KEY;
        let validated: boolean = true;

        if (!token) {
            validated = false;
            return res.status(400).send({ message: "missing token" });
        }

        if (validated) {

            await axios.post(uri, {

                token: token,
                returnSecureToken: true

            }).then((signInResponse) => {
                return res.status(201).send(signInResponse.data);
            }).catch((error) => {

                const err = error as AxiosError;
                return res.status(400).send({
                    message: err
                });

            });

        } else {
            return res.status(400).send({
                message: "there were validation error(s), check request payload"
            });
        }

    } catch (err) {
        return handleError(res, err);
    }

    return undefined;

}

function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}