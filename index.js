const DataBase = require('./DataBase');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const base = new DataBase();
const port = process.env.PORT || config.port;

app.use(cors());
app.use(express.json());

mongoose.connect(config.database, {useNewUrlParser: true})
    .then(err => {
        if (!err) {
            console.log('Can\'t connect to data base, try again...');
            return;
        }
        app.listen(port, console.log(`Server on port ${port} is start`));
    });

app.get('/home/user/:token', (req, res) => {  // get user
    base.getUser(req.params.token).then(
        resolve => res.status(200).send(resolve),
        reject => res.status(404).send(reject)
    );
});
app.get('/', (req, res) => {
	res.status(200).send('Server on air...');
});

app.put('/home/user/:token', (req, res) => {  // edit user
    base.updateUser(req.params.token, req.body).then(
        resolve => res.status(200).send(JSON.stringify(resolve)),
        reject => res.status(404).send(JSON.stringify(reject)))
});

app.get('/home/category/:token', (req, res) => {  // get category list
    base.getUserCategory(req.params.token).then(
        resolve => res.status(200).send(resolve),
        reject => res.status(404).send(reject)
    );
});

app.get('/home/:category/:token', (req, res) => { // get category items list
    base.getCategoryItemList(req.params.token, req.params.category).then(
        resolve => res.status(200).send(resolve),
        reject => res.status(404).send(reject)
    );

});

app.get('/home/:category/:id/:token', (req, res) => {// get category item by id
    base.getItem(req.params.token, req.params.category, req.params.id).then(
        resolve => res.status(200).send(resolve),
        reject => res.status(404).send(reject)
    );
});

app.post('/home/:category/:token', (req, res) => {// create new item
 base.newItem(req.params.token, req.params.category, req.body).then(
 resolve => res.status(200).send(JSON.stringify(resolve)),
 reject => res.status(404).send(JSON.stringify(reject)));
 });

app.put('/home/:category/:id/:token', (req, res) => {// update item
    base.updateItem(req.params.token, req.params.category, req.params.id, req.body).then(
        resolve => res.status(200).send(JSON.stringify(resolve)),
        reject => res.status(404).send(JSON.stringify(reject)));
});

app.delete('/home/:category/:id/:token', (req, res) => {// delete item
    base.deleteItem(req.params.token, req.params.category, req.params.id).then(
        resolve => res.status(200).send(JSON.stringify(resolve)),
        reject => res.status(404).send(JSON.stringify(reject)));
});

app.post('/authorization', (req, res) => {
    base.authorization(req.body).then(
        resolve => res.status(200).send(JSON.stringify(resolve)),
        reject => res.status(401).send(JSON.stringify(reject))
    );
});

app.post('/registration', (req, res) => {
    base.registration(req.body).then(
        resolve => res.status(200).send(JSON.stringify(resolve)),
        reject => res.status(401).send(JSON.stringify(reject))
    );
});
