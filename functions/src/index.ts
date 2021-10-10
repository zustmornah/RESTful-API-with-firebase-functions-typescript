import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

import express = require('express');
import { RequestHandler } from 'express';

import * as serviceAccount from './certificates/config.json';
const ServiceAccountPARAMS = {

    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url

}

admin.initializeApp({

    credential: admin.credential.cert(ServiceAccountPARAMS),
    databaseURL: "DATABASE_URL"

});

import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';

const app = express();
app.use(express.json() as RequestHandler);
app.use(express.urlencoded({
    extended: true
}) as RequestHandler);
app.use(cors({ origin: true }));

userRoutes(app);
authRoutes(app);

export const api = functions.https.onRequest(app);