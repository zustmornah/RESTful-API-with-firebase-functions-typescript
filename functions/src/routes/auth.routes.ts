import { Application } from "express";
import {
    signUserIn,
    reAuthenticate,
    GETCustomToken,
    GETIdTokens
} from "../controllers/auth.controller";
import { isAuthenticated } from "../services/authenticated";
import { isAuthorized } from "../services/authorized";

export function authRoutes(app: Application) {

    /** 
    * sign user 
    **/
    app.post('/sign_in',
        signUserIn
    );

    /**
    * reAuthenticate user
    **/
    app.get('/reauthenticate', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'user', 'manager'], allowSameUser: true }),
        reAuthenticate
    ]);

    /**
    * Create Custom Token for user uid
    **/
    app.post('/custom_token', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'user', 'manager'], allowSameUser: true }),
        GETCustomToken
    ]);

    /**
    * Exchange Custom Token for ID Token
    **/
    app.post('/id_token', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'user', 'manager'], allowSameUser: true }),
        GETIdTokens
    ]);

}