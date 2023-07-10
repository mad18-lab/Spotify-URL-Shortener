const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const validUrl = require('valid-url');
const shortid = require('shortid');

const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://admin:admin1234@urls.oeha3fm.mongodb.net/")
.then(() => {
    console.log("Database is connected.");
}).catch((err) => {
    console.log(err);
});

app.listen(4008, () => {
    console.log("Server is on.");
})

const urlSchema = {
    urlCode: String,
    longUrl: String,
    shortUrl: String,
    date: {
        type: String,
        required: Date.now
    }
}

const Model = mongoose.model("Model", urlSchema);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/homepage.html"));
})

const baseUrl = 'http:localhost:4008'

app.post("/result", (req, res) => {
    const { longUrl } = req.body.url;

    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base URL');
    }

    const urlCode = shortid.generate();

    if (validUrl.isUri(longUrl)) {
        try {
            const url = Model.findOne({ longUrl });
            if (url) {
                res.render('output', {
                    url: url
                })
            } else {
                const shortUrl = baseUrl + '/' + urlCode;

                url = new url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date()
                })

                url.save();
                res.render('output', {
                    url: url
                })
            }
        } catch(err) {
            console.log(err);
            res.status(400).json(err);
        }
    } else {
        res.send("Invalid URL");
    }
})