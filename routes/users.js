const express = require('express');
const router = express.Router();
let User = require('../models/users');


//NIS PAMETNO SAMO CRUD OPERACIJE


router.post('/add', (req, res, next) => {
    let user = new User(req.body);
    User.addUser(user, (err) => {
        if (err)
            return res.status(500).send("Server error!");
        return res.status(201).send("User saved!");
    });
});

router.patch('/edit', (req, res, next) => {
    let user = new User(req.body);
    User.saveUser(user, (err,data) => {
        if (err)
            return res.status(500).send("Server error!");
        return res.status(201).json(data);
    });
});


router.get('/view/:id', (req, res, next) => {
    User.getUserById(req.params.id.toString(), (err, user) => {
        if (err)
            return res.status(500).send("Server error!");
        if (!user)
            return res.status(422).send("User not found");
        return res.status(200).json(user);;
    });
});

router.get('/all', (req, res, next) => {
    User.geAll((err, users) => {
        if (err)
            return res.status(500).send("Server error!");
        return res.status(200).json(users);
    });
});

router.delete('/delete/:id', (req, res, next) => {
    User.removeUser(req.params.id.toString(), (err) => {
        if (err)
            return res.status(500).send("Server error!");
        return res.status(204).send("User removed!");
    });
});

module.exports = router;
