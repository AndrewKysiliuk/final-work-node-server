const Base = require('./module/Base');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('./config');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);


module.exports = class DataBase {

    getUser(token) {
        let decoded = jwt.verify(token, config.secret);
        return new Promise((resolve, reject) => {
            Base.users.findById(decoded.id, (err, docs) => {
                if (err) return reject('User not found');
                resolve(docs);
            });
        });
    }

    updateUser(token, user) {
        let decoded = jwt.verify(token, config.secret);
        return new Promise((resolve, reject) => {
            Base.users.findByIdAndUpdate(decoded.id, user, err => {
                if (err) return reject('User not found');
                resolve('User was edited');
            });
        });
    }

    getUserCategory(token) {
        let decoded = jwt.verify(token, config.secret);
        return new Promise((resolve, reject) => {
            Base.users.findById(decoded.id, err => {
                if (err) return reject('User not found');

                Base.category.find({}, (error, data) => {
                    if (error) return reject('Error in data base, try again later...');
                    resolve(data[0].categories);
                });
            });
        });
    }

    getCategoryItemList(token, category) {
        let decoded = jwt.verify(token, config.secret);
        return new Promise((resolve, reject) => {
            Base.category.find({}, (err, data) => {
                if (err) return reject('Item list not found');
                if (data[0].categories.find(item => item.category === category)) {
                    Base.item(category).find({user_id: decoded.id}, (er, docs) => {
                        if (er) return reject('Item list not found');
                        resolve(docs);
                    });
                } else {
                    reject('Invalid category');
                }
            });
        });
    }


    getItem(token, category, id) {
        let decoded = jwt.verify(token, config.secret);
        return new Promise((resolve, reject) => {
            Base.item(category).find({_id: id, user_id: decoded.id}, (err, data) => {
                if (err) return reject('Item not found');
                if(data[0])
                    resolve(data[0]);
                reject('Item not found');
            });
        });
    }

    newItem(token, category, item) {
        let decoded = jwt.verify(token, config.secret);
        return new Promise((resolve, reject) => {
            Base.users.findById(decoded.id, err => {
                if (err) return reject('User not found');
                item.user_id = decoded.id;
                Base.item(category).create(item, er => {
                    if (er) return reject('Create error');
                    resolve('Item was created');
                })
            });
        });
    }

    updateItem(token, category, id, item) {
        let decoded = jwt.verify(token, config.secret);
        return new Promise((resolve, reject) => {
            Base.users.findById(decoded.id, err => {
                if (err) return reject('User not found');

                Base.item(category).findByIdAndUpdate(id, item, er => {
                    if (er) return reject('Item not found');

                    resolve('Item was edited');
                })
            });
        });
    }

    deleteItem(token, category, id) {
        let decoded = jwt.verify(token, config.secret);
        return new Promise((resolve, reject) => {
            Base.users.findById(decoded.id, err => {
                if (err) return reject('User not found');

                Base.item(category).findByIdAndDelete(id, er => {
                    if (er) return reject('Item not found');

                    resolve('Item was deleted');
                });
            });
        });
    }

    authorization(item) {
        return new Promise((resolve, reject) => {
            Base.users.find({email: item.email}, (err, data) => {
                if (err) return reject('Invalid data');
                bcrypt.compare(item.password, data[0].password).then(res => {
                    if (res) {
                        let token = jwt.sign({"id": data[0]._id}, config.secret);
                        Base.users.findByIdAndUpdate(data[0]._id, {token: token}, error => {
                            if (error) return reject('Invalid update');

                            resolve(token);
                        });
                    } else {
                        reject('Invalid data');
                    }
                });
            });
        });
    }

    registration(item) {
        return new Promise((resolve, reject) => {
            let salt = bcrypt.genSaltSync(10);
            item.password = bcrypt.hashSync(item.password, salt);

            Base.users.findOne({email: item.email}, (err, data) => {
                if (err) return reject('Error');

                if (data) {
                    reject(`User witch E-mail: ${item.email} already exist`);
                } else {
                    Base.users.create(item, err => {
                        if (err) return reject('Create user error');
                        resolve('New user was create');
                    });
                }
            });

        });
    }

};

