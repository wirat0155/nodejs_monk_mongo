var express = require('express');
var router = express.Router();
const db = require('monk')('localhost:27017/nodejs_mongo');
const {check, validationResult} = require('express-validator');

// get all product
router.get('/', function(req, res, next) {
    var collection = db.get('product');
    collection.aggregate([{$sort: {'created_date': -1}}]).then((products, error) => {
        res.render('product', {products: products});
    })
});

// show add_product page
router.get('/add', function(req, res, next) {
    res.render('add_product');
});
router.post('/add', [
    check('name', 'Please input product name').not().isEmpty(),
    check('description', 'Please input description').not().isEmpty()
], function(req, res, next) {
    const result = validationResult(req);
    let errors = result.errors;
    if (!result.isEmpty()) {
        res.render('add_product', {errors: errors});
    } else {
        var collection = db.get('product');
        const created_date = new Date();
        collection.insert({
            name: req.body.name,
            description: req.body.description,
            created_date: created_date
        }, function(err, product){
            if(err) {
                res.send(err);
            } else {
                req.flash('error', 'Add product successfully');
                res.location('/product');
                res.redirect('/product');
            }
        });
    }
});

router.get('/edit/:id', function(req, res, next) {
    var collection = db.get('product');
    collection.findOne({_id: req.params.id}).then((product, error) => {
        res.render('edit_product', {product: product});
    });
})

router.post('/edit', [
    check('name', 'Please input product name').not().isEmpty(),
    check('description', 'Please input description').not().isEmpty()
], function(req, res, next) {
    const result = validationResult(req);
    let errors = result.errors;
    if (!result.isEmpty()) {
        req.flash('error', 'Update failed');
        res.redirect('/product/edit/' + req.body._id);
        
    } else {
        var collection = db.get('product');
        console.log(req.body);
        collection.update({_id: req.body._id}, {$set: {name: req.body.name, description: req.body.description}}).then(() => {
            req.flash('error', 'Update product successfully');
            res.redirect('/product');
        });
    }
});

router.get('/delete/:id', function(req, res, next) {
    var collection = db.get('product');
    collection.findOneAndDelete({_id: req.params.id}).then(() => {
        res.location('/product');
        res.redirect('/product');
    })
})

module.exports = router;