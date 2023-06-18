const express = require('express');
const bodyParser = require('body-parser');
const programmer = require('./database/tables/programmer');

const app = express();
const port = 5000;


app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/syncDatabase', async (req, res) => {
    const dataBase = require('./database/db');
    try {
        await dataBase.sync();
        res.send('Database sync')
    } catch (error) {
        res.send(error);
    }
});

app.post('/createProgrammer', async (req, res) => {
    try {
        const params = req.body

        const properties = ['name', 'python', 'java', 'javascript'];

        const check = properties.every((property) => {

            return ptoperty in params;
        });

        if (!check) {
            const proStr = properties.join(',');
            res.send(`All parameters needed to create a programmer must be sent: $(propStr)`);
            return;
        }

        const newProgrammer = await programmer.create({
            name: params.name,
            python: params.python,
            javascript: params.javascript,
            java: params.java
        });

        res.send(newProgrammer);
    } catch (error) {
        res.send(error);
    }

});
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

app.get('/retrieveProgrammer', async (req, res) => {
    try {

        const params = req.body;

        if ('id' in params) {

            const record = await programmer.findByPk(params.Id);

            if (record) {

                res.send(record);

            } else {

                res.send('No programmer found using received ID');
            }

            return;
        }
        const records = await programmer.findAll();

        res.send(records);
    } catch (error) {
        res.send(error);
    }
});

app.put('/updateProgrammer', async (req, res) => {

    try {

        const params = req.body;

        if (!('id' in params)) {
            res.send(`Missing 'id' in request body`);

            return;

        }

        const record = await programmer.findByPk(params.id);

        if (!record) {

            res.send(`Programmer ID not found.`);

            return;
        }
        const properties = ['name', 'python', 'java', 'javascript'];

        const check = properties.some((property) => {

            return property in params;
        });

        if (!check) {

            const propstr = properties.join(',');

            res.send(`Request body doesn't have any of the following properties: ${propStr}`);

            return;

        }

        record.name = params.name || record.name;
        record.python = params.python || record.python;
        record.java = params.java || record.java;
        record.javascript = params.javascript || record.javascript;

        await record.save();

        res.send(`${record.id} ${record.name} - Updated successfully`);

    } catch (error) {

        res.send(error);
    }
});

app.delete('/deleteProgrammer', async (req, res) => {

    try {

        const params = req.body;

        if (!('id' in params)) {

            res.send(`Missing 'id' in request body`);
            return;
        }

        const record = await programmer.findByPk(params.id);

        if (!record) {

            res.send(`Programmer ID not found.`);
            return;
        }

        await record.destroy();

        res.send(`${record.id} ${record.name} - Deleted successfully`);
    } catch (error) {
        res.send(error);

    }
});

const validateID = async (params) => {

    try {

        if (!('id') in params) {

            throw `Missing 'id' in request body`;

        }

        const record = await programmer.findByPk(params.id);

        if (!record) {
            throw `Programmer ID not found.`;

        }

        return record;
    } catch (error) {
        throw error;
    }
}

app.put('/updatprogramer', async (req, res) => {

    try {
        const params = req.body;

        const record = await validateID(params);

        const properties = ['name', 'python', 'java', 'javascript'];

        const check = properties.some((property) => {
            return property in params;

        });

        if (!check) {

            res.send(`Request body doesn't have any of the following properties:
${properties.join(', ')}`);
            return;
        }

        record.name = params.name || record.name;
        record.python = params.python || record.python;
        record.java = params.java || record.java;
        record.javascript = params.javascript | record.javascript;

        await record.save();

        res.send(`${record.id} ${record.name} - Updated successfully`);

    } catch (error) {
        res.send(error);
    }
});

app.delete('/deleteProgrammer', async (req, res) => {
    try {

        const params = req.body;

        const record = await validateID(params);

        record.destroy();

        res.send(`${record.id} ${record.name} - Deleted

successfully`);

    } catch (error) {
        res.send(error);

    }

});

const validateProperties = (properties, params, fn) => {
    try {
        const check = properties[fn]((property) => {
            return property in params;

        });

        if (!check) {

            const propStr = properties.join(',');
            throw `Request body doesn't have any of the following
properties: ${propStr}`;
        }

        return true;
    } catch (error) {
        throw error;
    }
}

app.post('/createProgrammer', async (req, res) => {

    try {

        const params = req.body;

        const properties = ['name', 'python', 'java', 'javascript'];
        validateProperties(properties, params, 'every');

        const newProgrammer = await programmer.create({
            name: params.name,
            python: params.python,
            javascript: params.javascript,
            java: params.java

        });

        res.send(newProgrammer);
    } catch (error) {
        res.send(error);

    }

});

app.put('/updateProgrammer', async (req, res) => {
    try {

        const params = req.body;

        const record = await validateID(params);

        const properties = ['name', 'python', 'java', 'javascript'];

        validateProperties(properties, params, 'some');

        record.name = params.name || record.name;
        record.python = params.python || record.python;
        record.java = params.java || record.java;
        record.javascript = params.javascript || record.javascript;

        await record.save();

        res.send(`${record.id} ${record.name} - Updated successfully`);

    } catch (error) {

        res.send(error);
    }

});