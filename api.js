var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1/mongo');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)

    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var todolistsSchema = new Schema({

    title: String,
    unChecked: Array,
    checked: Array,
    deleted: Boolean
});

app.get('/',function(req, res){

    res.sendFile(__dirname + '/index.html');
});

var todolists = mongoose.model('todolists',todolistsSchema);

app.get('/todolists',function(req, res){

    todolists.find({deleted: false},function(err, results){

        return res.send(results);
    });
});

app.post('/todolists',function(req, res){

    var title = req.body.title, unChecked = req.body.unChecked, checked = req.body.checked;

    var todolist = new todolists({

        title: title,
        unChecked: unChecked,
        checked: checked,
        deleted: false
    });

    todolist.save(function(err){

        if(err){

            return res.send(err);
        }

        return res.send({

            'status': 'success'
        });
    })
});

app.patch('/todolists/:id',function(req, res){

    var title = req.body.title, unChecked = req.body.unChecked, checked = req.body.checked, deleted = req.body.deleted;

    var todolist = {

        title: title,
        unChecked: unChecked,
        checked: checked,
        deleted: deleted
    }

    todolists.findOneAndUpdate({_id: req.params.id}, todolist, {upsert:true}, function(err, results){

        if(err){

            return res.send(err);
        }

        return res.send({

            'status': 'success'
        });
    });
});

app.delete('/todolists/:id',function(req, res){

    todolists.remove({_id: req.params.id}, function(err, results){

        if(err){

            return res.send(err);
        }

        return res.send({

            'status': 'success'
        });
    });
});

app.get('/deletedtodolists',function(req, res){

    todolists.find({deleted: true},function(err, results){

        return res.send(results);
    });
});

app.listen(3000);
