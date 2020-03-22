import {
    addnewContact,
    getContacts,
    getContactWithID,
    updateContact,
    deleteContact
} from "../controllers/crmController";

import { login, register, loginRequired } from "../controllers/userController";

const routes = (app) => {
    app.route("/contact")
        .get((req, res, next) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`)
            console.log(`Request type: ${req.method}`)
            next();
        }, loginRequired, getContacts)

        // Post endpoint
        .post(loginRequired, addnewContact);

    app.route("/contact/:id")
        // get a specific contact
        .get(loginRequired, getContactWithID)

        // updating a specific contact
        .put(loginRequired, updateContact)

        // deleting a specific contact
        .delete(loginRequired, deleteContact);

    //register route
    app.route("/auth/register")
        .post(register);

    //login route
    app.route("/auth/login")
        .post(login);
};

export default routes;
