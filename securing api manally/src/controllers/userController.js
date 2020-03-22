import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserSchema } from '../models/userModel';

const User = mongoose.model("User", UserSchema);
const numberOfRounds = 10;
const unauthorized = 401;
const badRequest = 400;

export const register = (req, res) => {
    const newUser = new User(req.body);
    newUser.hashPassword = bcrypt.hashSync(req.body.password, numberOfRounds);
    newUser.save((err, user) => {
        if (err) {
            return res.status(badRequest).send({
                message: err
            });
        }

        user.hashPassword = undefined;
        return res.json(user);
    });
};

export const login = (req, res) => {
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) {
            throw err;
        }

        if (!user) {
            res.status(unauthorized).json({
                message: "Authentication failed, no user found!"
            });
        } else if (user) {
            if (!user.comparePassword(req.body.password, user.hashPassword)) {
                res.status(unauthorized).json({
                    message: "Authentication failed, wrong password!"
                });
            }
        } else {
            return res.json({
                token: jwt.sign({
                    email: user.email,
                    username: user.username,
                    _id: user.id
                }, "RESTFULAPIs")
            });
        }
    });
};

export const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(unauthorized).json({
            message: "Unauthorized user!"
        });
    }
};