var router = require('express').Router();
const knex = require('../knex');
const Joi = require('@hapi/joi');
const secure = require('../secure');

const httpResponses = require('../httpResponses');

const aquariumErrors = {
    notExist: {
        message: "Aquarium not exists"
    },
    serverError: {
        message: "Internal server error"
    }
};

// AQUARIUM
const aquariumSchema = Joi.object({
    name: Joi.string().required()
});

router.get('/', async (req, res) => {
    try {
        let rows = await knex('aquariums').select('*');
        return res.json(rows);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json("server.error");
    }
});

router.post('/', secure({ min: 50 }), async (req, res) => {
    let validated = aquariumSchema.validate(req.body);
    if (validated.error)
        return res.status(400).json({ message: "Invalid or missing data" });

    try {
        let row = await knex('aquariums').insert({
            name: validated.value.name
        });
        return res.status(201).json({
            id: row[0]
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(aquariumErrors.serverError);
    }


});

router.get('/:id', async (req, res) => {
    try {
        let rows = await knex('aquariums').select('id', 'name').where('id', req.params.id);
        if (rows.length == 0) {
            return res.status(404).json({
                message: 'Aquarium not found'
            });
        } else {
            return res.json(rows[0]);
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(aquariumErrors.serverError);
    }
});

router.delete('/:id', secure({ min: 50 }), async (req, res) => {
    try {
        await knex('aquariums').delete().where('id', req.params.id);
        return res.json("deleted");
    }
    catch (err) {
        console.log(err);
        return res.status(500).json("server.error");
    }
});

// DATA

const querySchema = Joi.object({
    sort: Joi.string().valid('asc','desc'),
    limit: Joi.number().integer().min(1).max(250),
    offset: Joi.number().integer().positive()
});

router.get('/:id/data', async (req, res) => {
    let queryValidated = querySchema.validate(req.query);
    if (queryValidated.error)
        return res.status(400).json({ message: "Invalid query" });
    
    try {
        let rows = await knex('aquariums').select('id', 'name').where('id', req.params.id);
        if (rows.length == 0) {
            return res.status(404).json(aquariumErrors.notExist);
        }
        let query = knex('data').select('*').where('aquariumID', req.params.id);
        if(queryValidated.value.sort){
            query.orderBy('end',queryValidated.value.sort);
        }
        if(queryValidated.value.limit){
            query.limit(queryValidated.value.limit);
        }else{
            query.limit(250);
        }
        if(queryValidated.value.offset){
            query.offset(queryValidated.value.offset);
        }
        rows = await query;
        let datatypes = await knex('datatypes').select('*');
        for (const row of rows) {
            row.modified = new Date(row.modified);
            row.start = new Date(row.start);
            row.end = new Date(row.end);
            row.manual = new Boolean(row.manual);
            let parsedData = JSON.parse(row.data);
            row.data = {};
            for (const key in parsedData) {
                //console.log(datatypes.find(e => e.id == key));
                row.data[datatypes.find(e => e.id == key).key] = parsedData[key];
            }
        }
        return res.json(rows);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(aquariumErrors.serverError);
    }
});

const dataSchema = Joi.object({
    start: Joi.date().required(),
    end: Joi.date().required(),
    data: Joi.object().pattern(Joi.string(), Joi.any()).required()
});

router.post('/:id/data', secure({ min: 10 }), async (req, res) => {
    let validated = dataSchema.validate(req.body);
    if (validated.error)
        return res.status(400).json({ message: "Invalid or missing data" });

    try {
        let rows = await knex('aquariums').select('id', 'name').where('id', req.params.id);
        if (rows.length == 0) {
            return res.status(404).json(aquariumErrors.notExist);
        }
        let datatypes = await knex('datatypes').select('*');
        let data = {};
        for (const key in validated.value.data) {
            let datatype = datatypes.find(e => e.key == key);
            if (datatype) {
                if ((typeof validated.value.data[key] == 'number' && datatype.numeric) || (typeof validated.value.data[key] == 'string' && !datatype.numeric)) {
                    data[datatype.id] = validated.value.data[key];
                }
            }
        }

        let manual = req.tokenType == "user";
        let row = await knex('data').insert({
            manual: manual,
            start: validated.value.start,
            end: validated.value.end,
            modified: new Date(),
            aquariumID: req.params.id,
            data: JSON.stringify(data)
        });

        return res.json({ id: row[0] });
        //rows = await knex('data').select('*').where('id', req.params.id);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json("server.error");
    }
});

router.get('/:id/data/:dataid', async (req, res) => {
    try {
        let rows = await knex('aquariums').select('id', 'name').where('id', req.params.id);
        if (rows.length == 0) {
            return res.status(404).json(aquariumErrors.notExist);
        }
        rows = await knex('data').select('*').where('id', req.params.dataid);
        let datatypes = await knex('datatypes').select('*');
        if (rows.length == 0) {
            return res.status(404).json(httpResponses.notExist);
        }
        let row = rows[0];
        row.modified = new Date(row.modified);
        row.start = new Date(row.start);
        row.end = new Date(row.end);
        row.manual = new Boolean(row.manual);
        let parsedData = JSON.parse(row.data);
        row.data = {};
        for (const key in parsedData) {
            //console.log(datatypes.find(e => e.id == key));
            row.data[datatypes.find(e => e.id == key).key] = parsedData[key];
        }
        return res.json(row);

    }
    catch (err) {
        console.log(err);
        return res.status(500).json(aquariumErrors.serverError);
    }
});

router.put('/:id/data/:dataid', secure({ min: 10 }), async (req, res) => {
    let validated = dataSchema.validate(req.body);
    if (validated.error)
        return res.status(400).json({ message: "Invalid or missing data" });

    try {
        let rows = await knex('aquariums').select('id', 'name').where('id', req.params.id);
        if (rows.length == 0) {
            return res.status(404).json(aquariumErrors.notExist);
        }

        rows = await knex('data').select('*').where('id', req.params.dataid);
        if (rows.length == 0) {
            return res.status(404).json(httpResponses.notExist);
        }

        let datatypes = await knex('datatypes').select('*');
        
        let data = {};
        for (const key in validated.value.data) {
            let datatype = datatypes.find(e => e.key == key);
            if (datatype) {
                if ((typeof validated.value.data[key] == 'number' && datatype.numeric) || (typeof validated.value.data[key] == 'string' && !datatype.numeric)) {
                    data[datatype.id] = validated.value.data[key];
                }
            }
        }

        let manual = req.tokenType == "user";
        let row = await knex('data').where('id',req.params.dataid).update({
            start: validated.value.start,
            end: validated.value.end,
            modified: new Date(),
            data: JSON.stringify(data)
        });

        return res.json(httpResponses.updateSuccess);
        //rows = await knex('data').select('*').where('id', req.params.id);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json("server.error");
    }
});


module.exports = router; 