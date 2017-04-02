var express = require('express');
var router = express.Router();

var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test'; // test - имя базы данных, которую будем использовать


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.get('/test/:id', function(req, res, next) {
//     res.json({
//         status: 200,
//         message: 'Successfully',
//         data: {id: req.params.id}
//     });
// });

router.get('/get-all', function(req, result, next) {
    mongo.connect(url, function(err, db) {
        var resultArray = [];
        assert.equal(null, err);
        var cursor = db.collection('user-data').find(); // find() - вернет все записи в коллекции
        // cursor - нельзя передать как есть в ответе
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function() {
            result.json({
                status: 200,
                message: 'Get data successfully!',
                data: resultArray
            });
            db.close();
        });
    });
});

router.post('/insert', function(req, res, next) {
    var item = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    }
    mongo.connect(url, function(err, db) {
        assert.equal(null, err); // - проверка, если нет ошибок
        db.collection('user-data').insertOne(item, function(err, result) {
            assert.equal(null, err);
            res.json({
                status: 200,
                message: 'User added!'
            });
            db.close();
        });
    });
});

router.post('/update', function(req, res, next) {
    var item = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    }
    var id = req.body.id;
    mongo.connect(url, function(err, db) {
        assert.equal(null, err); // - проверка, если нет ошибок
        // В mongo _id - это не строка, а специальный объект - потому мы не можем
        // просто написать '_id': id - нужно id привести к такому типу - делаем это с помощью objectId()
        db.collection('user-data').updateOne({'_id': objectId(id)}, {$set: item}, function(err, result) {
            assert.equal(null, err);
            res.json({
                status: 200,
                message: 'User added!'
            });
            db.close();
        });
    });
});

router.post('/delete', function(req, res, next) {
    var id = req.body.id;
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('user-data').deleteOne({'_id': objectId(id)}, function(err, result) {
            assert.equal(null, err);
            res.json({
                status: 200,
                message: 'User deleted!'
            });
            db.close();
        });
    });
});

router.post('/test/submit', function(req, res, next) {
    req.check('email', 'Invalid email address').isEmail();
    req.check('password', 'Password is invalid').isLength({min: 4}).equals('qwerty');

    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        res.json({
            status: 400,
            message: 'ERROR',
            data: req.session.errors
        });
    } else {
        res.json({
            status: 200,
            message: 'Successfully',
            data: req.body // < - все переданные параметры
        });
    }
});

module.exports = router;
