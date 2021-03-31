var router = require('express').Router();
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const privateKey = require('fs').readFileSync(process.env.DATA_DIR + '/private.pem');
const Joi = require('@hapi/joi');

const loginShema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().max(40).required()
});

router.post('/', async (req, res) => {
    let validated = loginShema.validate(req.body);
    if (validated.error)
        return res.status(401).json({ message: "Invalid or missing data" });

    let userData;
    try {
        const rows = await knex('users').select('id', 'email', 'hash').where({ email: validated.value.email });
        if (rows.length < 1) {
            return res.status(401).json({ message: "Missing account for this credential" });
        }
        userData = rows[0];
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

    let match = await bcrypt.compare(validated.value.password, userData.hash.toString());
    if (!match) return res.status(401).json({ message: "Missing account for this credential" });

    let refreshToken = jwt.sign({
        id: userData.id,
        type: 'refresh'
    },
        privateKey,
        { algorithm: 'RS256', expiresIn: 365 * 24 * 60 * 60 }
    );

    return res.status(200).json({
        token: refreshToken,
        id: userData.id
    });

});

module.exports = router; 