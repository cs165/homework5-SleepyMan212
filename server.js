const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('gsa-sheets');

const key = require('./privateSettings.json');

// TODO(you): Change the value of this string to the spreadsheet id for your
// GSA spreadsheet. See HW5 spec for more information.
const SPREADSHEET_ID = '1gqbnMZBq-9VVPGgmt1KY1f1xujX05WXBhPxwKxLzyHw';

const app = express();
const jsonParser = bodyParser.json();
const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);

app.use(express.static('public'));

async function onGet(req, res) {
    const result = await sheet.getRows();
    const rows = result.rows;
    tmp = [];
    for (let i = 1; i < rows.length; i++) {
        t = `{
          "${rows[0][0]}":"${rows[i][0]}",
          "${rows[0][1]}":"${rows[i][1]}"
        }`;
        tmp.push(JSON.parse(t));
    }

    // TODO(you): Finish onGet.

    res.json(tmp);
}
app.get('/api', onGet);

async function onPost(req, res) {
    const messageBody = req.body;
    console.log(messageBody);
    // TODO(you): Implement onPost.
    tmp = [];
    for (let v in messageBody) {
        console.log(v);
        if (messageBody.hasOwnProperty(v)) {
            tmp.push(messageBody[v]);
        }
    }
    console.log(tmp);
    sheet.appendRow(tmp)
        .then(() => {
            res.json({
                status: 'success'
            })
        })
        .catch(() => {
            res.json({
                status: 'unimplemented'
            });
        })
}
app.post('/api', jsonParser, onPost);

async function onPatch(req, res) {
    const column = req.params.column;
    const value = req.params.value;
    const messageBody = req.body;
    const result = await sheet.getRows();
    const rows = result.rows;

    // TODO(you): Implement onPatch.
    let i, j, k;
    for (i = 0; i < rows[0].length; i++) {
        console.log(rows[0][i]);
        if (rows[0][i] == column) {
            break;
        }
    }
    for (j = 1; j < rows.length; j++) {
        if (rows[j][i] == value) break;
    }
    const key = Object.keys(messageBody);
    for (k = 0; k < rows[0].length; k++) {
        if (rows[0][k] == key[0]) break;
    }

    rows[j][k] = messageBody[key[0]];

    sheet.setRow(j, rows[j])
        .then(() => {
            res.json({
                status: 'success'
            });
        })
        .catch(() => {
            res.json({
                status: 'unimplemented'
            });
        })
}
app.patch('/api/:column/:value', jsonParser, onPatch);

async function onDelete(req, res) {
    const column = req.params.column;
    const value = req.params.value;

    // TODO(you): Implement onDelete.
    const result = await sheet.getRows();
    const rows = result.rows;

    let i, j;
    for (i = 0; i < rows[0].length; i++) {
        console.log(rows[0][i]);
        if (rows[0][i] == column) {
            console.log('find the column');
            break;
        }
    }
    for (j = 1; j < rows.length; j++) {
        if (rows[j][i] == value) break;
    }

    // console.log(`i = ${i}`);
    sheet.deleteRow(j);
    res.json({
        status: 'success'
    });
}
app.delete('/api/:column/:value', onDelete);


// Please don't change this; this is needed to deploy on Heroku.
const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`cs165: Server listening on port ${port}!`);
});
