export interface emailPasswordSignInModel {
    email: string,
    password: string
}

export interface customTokenModel {
    uid: string
}

export interface iDTokensModel {
    token: string
}

export interface reAuthenticationModel {
    refresh_token: string
}

export interface emailVerificationPayloadModel {
    displayName: string,
    email: string,
    id: string
}

export interface emailVerificationHandlerModel {
    id: string
}

export interface userAuthEmailModel {
    email: string,
    id: string
}

export interface userAuthRoleModel {
    role: string,
    id: string
}

export interface userAuthPasswordModel {
    password: string,
    id: string
}

export interface userAuthUserModel {
    id: string
}
