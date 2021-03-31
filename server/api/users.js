var router = require('express').Router();
const knex = require('../knex');
const Joi = require('@hapi/joi');
const secure = require('../secure');
const httpResponses = require('../httpResponses');

router.get('/', secure({min:50}), async (req, res) => {
    try {
        let rows = await knex('users').select('*');
        let users = [];
        for (let row of rows) {
            users.push({
                id: row.id,
                email: row.email,
                firstname: row.firstname,
                lastname: row.lastname,
                permissions: row.permissions
            });
        }
        return res.json(users);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(httpResponses.serverError);
    }
});

router.get('/:id', secure({min:50}), async (req, res) => {
    try {
        let rows = await knex('users').select('*').where('id', req.params.id);
        if (rows.length == 0) {
            return res.status(404).json(httpResponses.notExist);
        } else {
            return res.json({
                id: rows[0].id,
                email: rows[0].email,
                firstname: rows[0].firstname,
                lastname: rows[0].lastname,
                permissions: rows[0].permissions
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(httpResponses.serverError);
    }
});

const permissionSchema = Joi.object({
    permissions: Joi.number().min(0).max(50)
});

router.put('/:id/permissions', secure({min:50}), async (req, res) => {
    let validated = permissionSchema.validate(req.body);
    if (validated.error)
        return res.status(400).json(httpResponses.invalidData);

    try {
        let rows = await knex('users').select('*').where('id', req.params.id);
        if (rows.length == 0) {
            return res.status(404).json(httpResponses.notExist);
        }
        await knex('users').where('id', req.params.id)
            .update({ permissions: validated.value.permissions })
        
            return res.status(200).json(httpResponses.updateSuccess);

    }
    catch (err) {
        console.log(err);
        return res.status(500).json(httpResponses.serverError);
    }
});

module.exports = router; 