const knex = require('./knex');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { generateKeyPairSync } = require('crypto');

module.exports = async () => {

    if (!fs.existsSync(process.env.DATA_DIR)) {
        fs.mkdirSync(process.env.DATA_DIR);
    }

    if (!fs.existsSync(process.env.DATA_DIR + '/private.pem') || !fs.existsSync(process.env.DATA_DIR + '/public.pem')) {
        let { publicKey, privateKey } = generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
        fs.writeFileSync(process.env.DATA_DIR + '/private.pem', privateKey);
        fs.writeFileSync(process.env.DATA_DIR + '/public.pem', publicKey);
    }

    // Initialiser la base de donnée
    let version = 0;
    if (await knex.schema.hasTable('info')) {// Si la BD n'a pas de version
        version = (await knex('info').select('value').where({ info: 'db_version' }))[0].value;
    } else {
        await knex.schema.createTable('info', (details) => {
            details.increments('id').primary();
            details.string('info');
            details.integer('value');
        });
        await knex('info').insert({ info: 'db_version', value: 0 });
    }

    if (version == 0) {
        await knex.schema.createTable('users', (users) => {
            users.increments('id').primary();
            users.string('email', 100).unique().notNullable();
            users.binary('hash', 60).notNullable();
            users.string('firstname', 50);
            users.string('lastname', 50);
            users.integer('permissions').unsigned().notNullable();
        }).createTable('aquariums', (aquariums) => {
            aquariums.increments('id').primary();
            aquariums.string('name', 50).notNullable();
        }).createTable('data', (data) => {
            data.increments('id').primary();
            data.integer('aquariumID').unsigned().notNullable().references('id').inTable('aquariums');
            data.boolean('manual').notNullable();
            data.dateTime('modified').notNullable();
            data.dateTime('start');
            data.dateTime('end');
            data.json('data').notNullable();
        }).createTable('datatypes', (datatypes) => {
            datatypes.increments('id').primary();
            datatypes.string('key', 50).notNullable();
            datatypes.boolean('numeric').notNullable();
            datatypes.string('name', 50).notNullable();
            datatypes.string('units', 20);
        }).createTable('texts', (texts) => {
            texts.increments('id').primary();
            texts.string('key', 50).notNullable();
            texts.string('text',5000).notNullable();
        });

        // add default values
        await knex('datatypes').insert(JSON.parse(fs.readFileSync('default-datatypes.json')));
        let hash = await bcrypt.hash('admin', 10);
        await knex('users').insert({
            email:'admin',
            hash:hash,
            permissions:50
        });
        await knex('aquariums').insert({
            name:'Aquarium principal'
        });
        await knex('texts').insert({
            key:'accueil',
            text:'Modifier dans les paramètres ce texte...'
        });
        version++;
    }

    await knex('info').where({ info: 'db_version' }).update({ value: version });
}