var router = require('express').Router();
const knex = require('../knex');
const Joi = require('@hapi/joi');
const secure = require('../secure');



router.get('/', async (req, res) => {
    try {
        let rows = await knex('datatypes').select('key','numeric','name','units');
        for (const row of rows) {
            row.numeric = new Boolean(row.numeric);
        }
        return res.json(rows);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json("server.error");
    }
});

const datatypeSchema = Joi.object({
    key: Joi.string().max(100).required(),
    name: Joi.string().max(100).required(),
    numeric: Joi.bool().required(),
    units: Joi.string().max(20)
});

router.post('/', async (req, res) => {
    let validated = datatypeSchema.validate(req.body);
    if (validated.error) {
        console.log(validated.error.details[0].type);
        return res.status(400).json("request.invalid");
    }

    try {
        const rows = await knex('datatypes').select('key').where({ key: validated.value.key });
        if (rows.length > 0) {
            return res.status(409).json("datatype.exist");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json("server.error");
    }

    try {
        await knex('datatypes').insert(validated.value);

    } catch (err) {
        console.log(err);
        return res.status(500).json("server.error");
    }

    return res.status(201).json('created');
});



module.exports = router; 