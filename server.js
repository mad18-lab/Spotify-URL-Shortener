const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortId = require('shortid');
const ejs = require('ejs');

const app = express();

app.use(express.json({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin:admin1234@urls.oeha3fm.mongodb.net/", {useNewUrlParser: true}, {useUnifiedTopology: true})
.then(() => {
    console.log("Database is connected.");
}).catch((err) => {
    console.log(err);
});

app.listen(4008, () => {
    console.log("Server is on.");
})

const urlSchema = {
    shortURL: String,
    longURL: String,
    id: String
}

const Model = mongoose.model("Model", urlSchema);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/homepage.html"));
})

const baseUrl = 'http://localhost:4008';

app.post("/result", (req, res) => {
    const longUrl = req.body.url;
    const id = shortId.generate();

    const result = baseUrl + '/' + id;

    res.render('output', {
        url: result
    })

    const saving = new Model({
        shortURL: result,
        longURL: longUrl,
        id: id
    })
    saving.save();
});

app.get("/:id", async(req, res) => {
    const url = await Model.findOne({id: req.params.id});

    if (url) {
        console.log("Original link found. Redirecting...");
        return res.redirect(url.longURL);
    }
    else {
        console.log("Error generated.");
        res.status(400).send("Error Generated.");
    }
});
