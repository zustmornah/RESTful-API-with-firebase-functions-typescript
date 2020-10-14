import { Application } from "express";
import { create, all, get, patch, remove, patch_userpass, patch_userRole } from "./controller";
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";


export function routesConfig(app: Application) {

    //create user
    app.post('/create_user',
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'manager'] }),
        create
    );
    // get all users
    app.get('/users', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'manager'] }),
        all
    ]);
    // get :id user
    app.get('/users/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
        get
    ]);
    // updates :id user
    app.patch('/users/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'user', 'manager'], allowSameUser: true }),
        patch
    ]);
    // patch user password: user id
    app.patch('/user_pass/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'user', 'manager'], allowSameUser: true }),
        patch_userpass
    ]);
    //patch user role: user id
    app.patch('/user_role/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'manager'] }),
        patch_userRole
    ]);
    // delete user :id user
    app.delete('/users/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'manager'] }),
        remove
    ]);

}