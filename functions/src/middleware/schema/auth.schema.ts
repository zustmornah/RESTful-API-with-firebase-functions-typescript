import { Schema } from "../validators/ingress.validators";

export const emailPasswordSignInSchema: Schema = {
    fields: {
        email: "string",
        password: "string",

    },
    required: [
        "email",
        "password",
    ],
};

export const customTokenSchema: Schema = {
    fields: {
        uid: "string",
    },
    required: ["uid"],
};

export const iDTokensSchema: Schema = {
    fields: {
        token: "string",
    },
    required: ["token"],
};

export const reAuthenticationSchema: Schema = {
    fields: {
        refresh_token: "string",
    },
    required: ["refresh_token"],
};

export const resetEmailSchema: Schema = {
    fields: {
        email: "string",
    },
    required: [
        "email",
    ],
};

export const emailVerificationLinkSchema: Schema = {
    fields: {
        displayName: "string",
        email: "string",
        id: "string",
    },
    required: [
        "displayName",
        "email",
        "id",
    ],
};

export const emailVerificationHandlerSchema: Schema = {
    fields: {
        user_type: "string",
        id: "string",
    },
    required: [
        "user_type",
        "id",
    ],
};

export const userAuthEmailSchema: Schema = {
    fields: {
        email: "string",
        id: "string",
    },
    required: [
        "email",
        "id",
    ],
};

export const userAuthRoleSchema: Schema = {
    fields: {
        role: "string",
        id: "string",
    },
    required: [
        "role",
        "id",
    ],
};

export const userAuthPasswordSchema: Schema = {
    fields: {
        password: "string",
        id: "string",
    },
    required: [
        "password",
        "id",
    ],
};

export const userAuthUserSchema: Schema = {
    fields: {
        id: "string",
    },
    required: [
        "id",
    ],
};
