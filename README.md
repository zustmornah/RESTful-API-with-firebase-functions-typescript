# Firebase NodeJS RESTful app with Auth middleware

# Building RESTful HTTP APIs with Cloud Functions, Firestore, Express and TypeScript

You will need a Firebase project and firebase tools cli

```
npm install -g firebase-tools
```

## Clone this repository

```
git clone git@github.com:zustmornah/rest-api-firebase-nodeJS-auth_middleware.git .
```

## Updating firebase project id

You need to change the firebase project name in _.firebaserc_ file.

```
{
  "projects": {
    "default": "YOUR-FIREBASE-PROJECT-ID"
  }
}
```

## Updating firebase config.json

You need to update your project config json in _functions/src/certificates/config.json_ to match the firebase permission json generated for your project.

```
{
  "type": "service_account",
  "project_id": "YOUR-FIREBASE-PROJECT-ID",
  "private_key_id": "PROJECT-PRIVATE-KEY_ID",
  "private_key": "PROJECT-PRIVATE-KEY",
  "client_email": "PROJECT-EMAIL",
  "client_id": "CLIENT_ID",
  "auth_uri": "AUTH-URL",
  "token_uri": "AUTH_TOKEN-URL",
  "auth_provider_x509_cert_url": "AUTH_PROVIDER-URL",
  "client_x509_cert_url": "CLIENT-AUTH_CERT-URL"
}
```

After that, you can log in to firebase in your terminal

```
firebase login
```

## Deploy to firebase

To deploy functions to firebase

```
firebase deploy
```

## Read values from the request

Content Type\n
Request Body\n
Behavior\n

```
application/json
'{"name":"John"}'
request.body.name equals 'John'
```

```
application/octet-stream
'my text'
request.body equals '6d792074657874' (the raw bytes of the request; see the Node.js Buffer documentation)
```

```
text/plain
'my text'
request.body equals 'my text'
```

```
application/x-www-form-urlencoded
'name=John'
request.body.name equals 'John'
```

## Adding Middleware

Add middleware to authenticate requests or perform additional tasks

```
let myMiddleware = (req, res, next) => {
    //authentication code goes here
    next();
}

app.use(myMiddleware);
```

## Building multiple CRUD interfaces:

GET /

```
app.get('/', (req, res) => {
    let response = Endpoints.list();
    res.send(response);
});
```

GET /:id

```
app.get('/:id', (req, res) => {
    let id = req.params.id;
    let response = Endpoints.getById(id);
    res.send(response);
});
```

POST /

```
app.post('/', (req, res) => {
    let response = Endpoints.create();
    res.send(response);
});
```

PUT /:id

```
app.put('/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let response = Endpoints.update(id, body);
    res.send(response);
});
```

PATCH /:id

```
app.patch('/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let response = Endpoints.update(id, body);
    res.send(response);
});
```

DELETE /:id

```
app.delete('/:id', (req, res) => {
    let id = req.params.id;
    let response = Endpoints.delete(id);
    res.send(response);
});
```
