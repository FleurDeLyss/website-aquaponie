var router = require('express').Router();
const knex = require('../knex');
const Joi = require('@hapi/joi');
const secure = require('../secure');
const httpResponses = require('../httpResponses');

router.get('/', async (req, res) => {
    try {
        let rows = await knex('texts').select('*');
        return res.json(rows);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(httpResponses.serverError);
    }
});

const keySchema = Joi.string().pattern(/^[a-z\-]+$/);

router.get('/:key', async (req, res) => {
    if (keySchema.validate(req.params.key).error)
        return res.status(400).json(httpResponses.invalidParams);

    try {
        let rows = await knex('texts').select('*').where('key', req.params.key);
        if (rows.length == 0) {
            return res.status(404).json(httpResponses.notExist);
        } else {
            return res.json(rows[0]);
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(httpResponses.serverError);
    }
});


const textSchema = Joi.object({
    text: Joi.string().max(5000)
});

router.put('/:key', secure({min:50}), async (req, res) => {
    if (keySchema.validate(req.params.key).error)
        return res.status(400).json(httpResponses.invalidParams);
    
    let validated = textSchema.validate(req.body);
    if (validated.error)
        return res.status(400).json(httpResponses.invalidData);

    try {
        let rows = await knex('texts').select('*').where('key', req.params.key);
        if (rows.length == 0) {
            return res.status(404).json(httpResponses.notExist);
        }
        await knex('texts').where('key', req.params.key)
            .update({ text: validated.value.text })
        
            return res.status(200).json(httpResponses.updateSuccess);

    }
    catch (err) {
        console.log(err);
        return res.status(500).json(httpResponses.serverError);
    }
});


module.exports = router; 