var router = require('express').Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');

const signupShema = Joi.object({
    email: Joi.string().max(100).email().required(),
    password: Joi.string().min(8).max(40).required(),
    firstname: Joi.string().min(1).max(50).required(),
    lastname: Joi.string().min(1).max(50).required()
});

router.post('/', async (req, res) => {
    let validated = signupShema.validate(req.body);
    if (validated.error) {
        console.log(validated.error.details[0].type);
        return res.status(400).json("request.invalid");
    }

    try {
        const rows = await knex('users').select('id').where({ email: validated.value.email });
        if (rows.length > 0) {
            return res.status(409).json("account.exist");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json("server.error");
    }

    let hash = await bcrypt.hash(validated.value.password, 10);

    try {
        await knex('users').insert({
            email: validated.value.email,
            hash: hash,
            firstname: validated.value.firstname,
            lastname: validated.value.lastname,
            permissions:0
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json("server.error");
    }

    return res.status(201).json('created');
});

module.exports = router; 