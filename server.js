require('dotenv').config();
const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const app = express();

mongoose.connect(process.env.MONGO_URI, {serverSelectionTimeoutMS: 5000, 
                                         retryWrites: true,
                                         useUnifiedTopology: true,
                                         useNewUrlParser:true})
    .catch(err => console.log(err));

const Schema = mongoose.Schema;
const urlSchema = new Schema({
    original_url: String,
    short_url: String
});
const URL = mongoose.model("URL", urlSchema);


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req,res) => {
    let url = req.body.url;
    
    if(!validUrl.isWebUri(url)){
        res.json({
            "error": "Invalid URL"
        });
    }
    else {
        let findUrl = await URL.findOne({
            original_url: url
        });
        let counted = URL.countDocuments(function (err, count) {
            if(err)
                return err;
            return count;
        });
        console.log("Number of counted docs");
        console.log(counted);
        if(findUrl){
            console.log(findUrl);
        } 
        // else {
        //     findOne = new URL({
        //         original_url: url,


    }

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
