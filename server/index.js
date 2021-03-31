"use strict";
global.__base = __dirname;
require('dotenv').config();
process.env.DATA_DIR = process.env.DATA_DIR || __dirname+'/data';

let express = require("express");
var cors = require('cors');
let app = express();
const path = require('path');
require('./init')();

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('../client/dist'));

app.use((err, req, res, next) => {
    // bad request - invalid json
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.sendStatus(400);
    }
    next();
});


app.use('/api', require('./api'));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
