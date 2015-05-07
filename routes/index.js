var _ = require('underscore'),
    keystone = require('keystone'),
    i18n = require("i18n"),
    middleware = require('./middleware'),
    importRoutes = keystone.importer(__dirname);

// Add-in i18n support
keystone.pre('routes', i18n.init);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {
    
    // Views
    app.get('/', routes.views.index);
    app.get('/lang/:locale', function (req, res) { res.cookie('locale', req.params.locale); res.locals.lang=req.params.locale; res.redirect("/"); });
    app.get('/blog/:category?', routes.views.blog);
    app.get('/blog/post/:post', routes.views.post);
    app.get('/gallery', routes.views.gallery);
    app.get('/about', routes.views.about);
    // Order
    app.get('/order-details', routes.views.orderDetails);
    app.get('/delivery-details', routes.views.deliveryDetails);
    app.get('/payment-details', routes.views.paymentDetails);
    
    app.all('/contact', routes.views.contact);
    app.get('/faq', routes.views.faq);
    app.get('/partners', routes.views.partners);
    app.get('/search-people', routes.views.searchPeople);
    app.get('/conditions', routes.views.conditions);


    app.all('/shop', routes.views.shop);
    app.all('/shop/type=:type?', routes.views.shop);
    app.all('/shop/type=:type?/category=:category?', routes.views.shop);
    app.all('/shop/state=:state?', routes.views.shop);
    app.all('/shop/indicator=:indicator?', routes.views.shop);
    app.all('/shop/product/:product', routes.views.product);
    app.all('/checkout', routes.views.checkout);
    
}
