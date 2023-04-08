/* eslint-disable padded-blocks */
/* eslint-disable require-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */

export const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const passwordReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
export const phoneReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
export const newPhoneReg = /^\+[1-9]\d{10,14}$/;

export function IsValidString(niceString: string): boolean {
    return typeof niceString === "string";
}

export function IsValidNumber(jumpyNumber: number): boolean {
    return typeof jumpyNumber === "number";
}

export function IsValidArray(anArray: object): boolean {
    return Array.isArray(anArray);
}

export function IsValidObject(niftyObject: object): boolean {
    return typeof niftyObject === "object";
}

export function IsValidBoolean(bipolarGuy: boolean): boolean {
    return typeof bipolarGuy === "boolean";
}

export type Schema = {
    fields: { [key: string]: string }
    required?: string[]
}

const isRequired = (obj: any, required: string[]) => {

    for (const key of required) {
        if (obj[key] === undefined || obj[key] === "") {
            return key;
        }
    }

    return true;

};

export const validateRequiredFields = async (obj: any, model: Schema) => {

    if (model.required) {
        const dataField = isRequired(obj, model.required);
        if (dataField !== true) {
            return "missing " + dataField + " field, " + dataField + " field is required";
        }
    }

    return true;

};

export const validateDataTypes = async (obj: any, model: Schema) => {

    for (const key of Object.keys(obj)) {

        if (model.fields[key] === undefined) {
            return "null or undefined " + model.fields[key] + " field";
        } else if (typeof obj[key] !== model.fields[key]) {
            return "invalid " + key + " datatype, expected datatype: " + model.fields[key];
        }

    }

    return true;

};
