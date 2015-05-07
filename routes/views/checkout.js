var keystone = require('keystone'),
	async = require('async'),
	Order = keystone.list('Order');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	locals.data = {
		products: []
	};
	// Set locals
	locals.section = 'checkout';
	locals.paymentTypes = Order.fields.paymentType.ops;
	locals.deliveryTypes = Order.fields.deliveryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'order' }, function(next) {
		
		var application = new Order.model(),
			updater = application.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, products, lockProducts, email, phone, orderComment, paymentType, deliveryType, deliveryCity, deliveryComment, totalCost, deliveryCost, grandTotalCost',
			errorMessage: 'При формировании заказа допущены ошибки или не были заполнены все поля:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
				req.flash('success', 'Спасибо! Ваш заказ успешно отправлен! В скором времени я свяжусь с Вами для уточнения деталей.');
				return res.redirect('/shop')
			}
			next();
		});
		
	});

	// Load other products
	view.on('init', function(next) {
		var q = keystone.list('Product').model.find()
			.limit('3')
			.sort('-createdAt');
			
			
			q.exec(function(err, results) {
				locals.data.products = results;
				next(err);
			});
		});

	
	// Render the view
	view.render('checkout');
}
