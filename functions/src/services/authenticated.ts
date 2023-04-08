/* eslint-disable padded-blocks */
/* eslint-disable require-jsdoc */

import { NextFunction, Request, Response } from "express";
import * as admin from "firebase-admin";

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({
            message: "Unauthorized: No auth headers",
        });
    }

    if (!authorization.startsWith("Bearer")) {
        return res.status(401).send({
            message: "Unauthorized: No bearer in header",
        });
    }

    const split = authorization.split("Bearer ");
    if (split.length !== 2) {
        return res.status(401).send({
            message: "Unauthorized: Bearer length too short",
        });
    }

    const token = split[1];

    try {
        const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
        console.log("decodedToken", JSON.stringify(decodedToken));
        res.locals = { ...res.locals, uid: decodedToken.uid, role: decodedToken.role, email: decodedToken.email };
        return next();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(`${err.code} -  ${err.message}`);
        return res.status(401).send({
            message: "Unauthorized", code: err.code,
        });
    }

}
