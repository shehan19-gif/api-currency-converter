const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());

app.get("/list", (req, res) => {
    fetch(`http://api.exchangerate.host/list?access_key=${process.env.API_KEY}`)
    .then(res => res.json())
    .then(result => {
        let currenciesList = {};
        for(const symbol in result.currencies) {
            currenciesList = {...currenciesList, [symbol]: {code: symbol}}
        }
        res.json({symbols: {...currenciesList}});
    })
    .catch(err => {
        res.json({error: "Server Error"});
    })
});

app.get("/latest/:currency", (req, res) => {
    fetch(`http://api.exchangerate.host/live?access_key=${process.env.API_KEY}&source=${req.params.currency}`)
    .then(res => res.json())
    .then(result => res.json({rates: result.quotes}))
    .catch(err => res.json({err}));
});

app.get("/convert", (req, res) => {

    const { from, to, amount } = req.query;

    fetch(`http://api.exchangerate.host/convert?access_key=${process.env.API_KEY}&from=${from}&to=${to}&amount=${amount}`)
    .then(res => res.json())
    .then(result => res.json({result: result.info.quote}))
    .catch(err => res.json({err}));
});

app.listen(PORT);