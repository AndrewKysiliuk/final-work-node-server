const mongoose = require('mongoose');
const Schema = require('./Schema');

const schema = new Schema();

const usersSchema = schema.usersSchema();
const categorySchema = schema.categorySchema();
const itemSchema = schema.itemSchema();

const Users = mongoose.model('users', usersSchema, 'users');
const Category = mongoose.model('categories', categorySchema, 'categories');

exports.users = Users;
exports.category = Category;
exports.item = function Item (type) {
    return mongoose.model(`${type}`, itemSchema, `${type}`);
};