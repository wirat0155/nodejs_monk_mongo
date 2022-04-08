var express = require('express');
var router = express.Router();
const db = require('monk')('localhost:27017/nodejs_mongo');
const {check, validationResult} = require('express-validator');

/* GET product listing. */
router.get('/', function(req, res, next) {
    res.render('product');
});

/* GET add product. */
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
        collection.insert({
            name: req.body.name,
            description: req.body.description
        }, function(err, product){
            if(err) {
                res.send(err);
            } else {
                req.flash('error', 'Add product successfully');
                res.location('/product/add');
                res.redirect('/product/add');
            }
        });
    }
});

router.get('/edit', function(req, res, next) {
    res.send('edit the product');
})
router.get('/delete', function(req, res, next) {
    res.send('delete the product');
})

module.exports = router;