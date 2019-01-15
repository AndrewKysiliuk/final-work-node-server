const mongoose = require('mongoose');
const AppSchema = mongoose.Schema;

module.exports = class Schema {

    categorySchema() {
        let itemCategoty = new AppSchema({category: String, title: String}, {_id: false});
        return new AppSchema(
            {
                categories: [itemCategoty],
            },
            {
                versionKey: false
            }
        );
    }

    usersSchema() {
        return new AppSchema(
            {
                name: String,
                email: String,
                password: String,
                phone: Number,
                token: String,
                img: String
            },
            {
                versionKey: false
            }
        );
    }

    itemSchema() {
        let component = new AppSchema({
                name: String,
                count: String,
                type: String
            },
            {
                _id: false
            });
        let prepare = new AppSchema({
                img: String,
                info: String
            },
            {
                _id: false
            });
        return new AppSchema(
            {
                user_id: String,
                title: String,
                description: String,
                img: String,
                date: String,
                component: [component],
                prepare: [prepare]
            },
            {
                versionKey: false
            }
        );
    }
};