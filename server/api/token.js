var router = require('express').Router();
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const fs = require('fs');
const privateKey = fs.readFileSync(process.env.DATA_DIR + '/private.pem');
const publicKey = fs.readFileSync(process.env.DATA_DIR + '/public.pem');

router.get('/', async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(400).json({ message: "No token" });
    }

    let decoded;
    try {
        decoded = jwt.verify(req.headers.authorization.split(' ')[1], publicKey);
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }

    if (decoded.type != 'refresh') {
        return res.status(401).json({ message: "Invalid token type" });
    }

    let userData;
    try {
        let rows = await knex('users')
            .select('id', 'firstname', 'lastname','permissions')
            .where({ 'id': decoded.id });

        if (rows.length < 1) {
            throw "No user";
        }
        userData = rows[0];
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    let accessToken = jwt.sign({
        id: userData.id,
        permissions:userData.permissions,
        type: 'access'
    },
        privateKey,
        { algorithm: 'RS256', expiresIn: 15 * 60 }
    );

    return res.status(200).json({
        token: accessToken,
        id: userData.id,
        permissions:userData.permissions,
        firstname: userData.firstname,
        lastname: userData.lastname
    });
});


module.exports = router; 