import { Schema } from "../validators/ingress.validators";

export const userCreationWithEmailSchema: Schema = {
    fields: {
        displayName: "string",
        password: "string",
        role: "string",
        email: "string",
        phone: "string",
    },
    required: [
        "displayName",
        "password",
        "role",
        "email",
        "phone",
    ],
};

export const getUsersSchema: Schema = {
    fields: {
        startNumber: "number",
        pageSize: "number",
    },
    required: [],
};

export const getUserSchema: Schema = {
    fields: {
        id: "string",
    },
    required: [
        "id",
    ],
};

export const updateUserPhoneSchema: Schema = {
    fields: {
        id: "string",
        phone: "string",
    },
    required: [
        "id",
        "phone",
    ],
};
