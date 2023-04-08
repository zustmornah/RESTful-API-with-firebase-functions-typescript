/* eslint-disable padded-blocks */
/* eslint-disable require-jsdoc */

import { NextFunction, Request, Response } from "express";

export function isAuthorized(opts: { hasRole: Array<"admin" | "user" | "manager">, allowSameUser?: boolean }) {

    return (req: Request, res: Response, next: NextFunction) => {

        const { role, uid } = res.locals;
        const { id } = req.params;

        if (opts.allowSameUser && id && uid === id) {
            return next();
        }

        if (!role) {
            return res.status(403).send({
                message: "No Role Specified",
            });
        }

        if (opts.hasRole.includes(role)) {
            return next();
        }

        return res.status(403).send({
            message: "Unauthorized",
        });

    };

}
