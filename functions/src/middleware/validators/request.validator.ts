/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response, NextFunction } from "express";
import * as INGRESS_VALIDATOR from "../../middleware/validators/ingress.validators";

export const requestValidator = async (body: object, schema: any, res: Response, next: NextFunction) => {

    await INGRESS_VALIDATOR.validateRequiredFields(body, schema).then(async (returnedRequiredValidation) => {

        if (returnedRequiredValidation === true) {

            await INGRESS_VALIDATOR.validateDataTypes(body, schema).then(async (returnedTypeValidation) => {

                if (returnedTypeValidation === true) return true;

                return res.status(400).send({
                    message: returnedTypeValidation,
                });

            }).catch((error) => {
                return res.status(400).send({
                    message: error,
                });
            });

            return;

        }

        return res.status(400).send({
            message: returnedRequiredValidation,
        });

    }).catch((error) => {
        return res.status(400).send({
            message: error,
        });
    });

};
