import { Application } from "express";
import {
    createUser,
    getUsers,
    getUser,
    patchUser,
    patchUserPassword,
    patchUserRole,
    removeUser
} from "../controllers/user.controller";

import { isAuthenticated } from "../services/authenticated";
import { isAuthorized } from "../services/authorized";


export function userRoutes(app: Application) {

    /** 
    * Create user 
    **/
    app.post('/create_user',
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'manager'] }),
        createUser
    );

    /**
    * Get all users
    **/
    app.get('/users', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'manager'] }),
        getUsers
    ]);

    /**
    * GET user :id user
    **/
    app.get('/users/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
        getUser
    ]);

    /**
    * Update user :id user
    **/
    app.patch('/users/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'user', 'manager'], allowSameUser: true }),
        patchUser
    ]);

    /**
    * Patch user password :user id
    **/
    app.patch('/user_pass/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'user', 'manager'], allowSameUser: true }),
        patchUserPassword
    ]);

    /**
    * Patch user role :user id
    **/
    app.patch('/user_role/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'manager'] }),
        patchUserRole
    ]);

    /**
    * Delete user :user id
    **/
    app.delete('/users/:id', [
        isAuthenticated,
        isAuthorized({ hasRole: ['admin', 'manager'] }),
        removeUser
    ]);

}