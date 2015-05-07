var keystone = require('keystone'),
async = require('async'),
PersonalOrder = keystone.list('PersonalOrder');
Product = keystone.list('Product');

exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res),
    locals = res.locals;
    
    // Init locals
    locals.section = 'shop';
    
    locals.filters = {
        type: req.params.type,
        category: req.params.category,
        state: req.params.state,
        indicator: req.params.indicator
    };
    
    locals.data = {
        products: [],
        types: [],
        categories: []
    };
    locals.validationErrors = {};
    locals.enquirySubmitted = false;
    locals.indicators = Product.fields.Indicator.ops;
    locals.states = Product.fields.state.ops;
    locals.formData = req.body || {};

    // Load types
    view.on('init', function(next) {
        keystone.list('ProductType').model.find().exec(function(err, results) {
            if (err || !results.length) {
                return next(err);
            }
            locals.data.types = results;
            next(err);
        });
        
    });
    // Load the current type filter
    view.on('init', function(next) {
        
        if (req.params.type) {
            keystone.list('ProductType').model.findOne({ key: locals.filters.type }).exec(function(err, result) {
                locals.data.type = result;
                next(err);
            });
        } else {
            next();
        }
    });
    // Load the current category filter
    view.on('init', function(next) {
        if (req.params.category) {
            keystone.list('ProductCategory').model.findOne({
                key: locals.filters.category
            }).exec(function(err, result) {
                locals.data.category = result;
                next(err);
            });
        } else {
            next();
        }
    });
    // Load categories
    view.on('init', function(next) {
        if (locals.data.type) {
            keystone.list('ProductCategory').model.find().populate('type').where('type').in([locals.data.type]).exec(function(err, results) {
                if (err || !results.length) {
                    return next(err);
                }
                locals.data.categories = results;
                next(err);
            });
        } else {
            next();
        }
    });
    
    // Load the products
    view.on('init', function(next) {
        var q = keystone.list('Product').paginate({
                page: req.query.page || 1,
                perPage: 16,
                maxPages: 100
            })
            .populate('category');
        
        if (locals.data.type) {
            q.where('type').in([locals.data.type]);
        }

        if (locals.data.category) {
            q.where('category').in([locals.data.category]);
        }

        if (locals.filters.state) {
            q.where('state').in([locals.filters.state]);
        }

        if (locals.filters.indicator) {
            q.where('Indicator').in([locals.filters.indicator]);
        }
        
        q.exec(function(err, results) {
            locals.data.products = results;
            next(err);
        });


    });

    // On POST requests, add the Enquiry item to the database
    view.on('post', { action: 'personal' }, function(next) {
        var application = new PersonalOrder.model(),
            updater = application.getUpdateHandler(req);
        
        updater.process(req.body, {
            flashErrors: true,
            fields: 'product, order, name, email, phone, comment',
            errorMessage: 'При формировании заказа допущены ошибки или не были заполнены все поля:'
        }, function(err) {
            if (err) {
                locals.validationErrors = err.errors;
            } else {
                locals.enquirySubmitted = true;
                req.flash('success', 'Спасибо! Ваш индивидуальный заказ успешно отправлен! В скором времени я свяжусь с Вами для уточнения деталей.');
                // return res.redirect('/shop')
            }
            next();
        });
        
    });
    
    // Render the view
    view.render('shop');
}
