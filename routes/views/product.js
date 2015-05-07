var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'shop';
	locals.filters = {
		product: req.params.product
	};
	locals.data = {
		product: '',
		type: '',
		products: [],
		types: [],
	};
	
	// Load all types
	view.on('init', function(next) {
		keystone.list('ProductType').model.find().exec(function(err, results) {
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.types = results;
			next();
		});
		
	});



	// Load the current product
	view.on('init', function(next) {
		
			var q = keystone.list('Product').model.findById(locals.filters.product)
			.populate('category')

			q.exec(function(err, result) {
				locals.data.product = result;
				next(err);
			});
	});

	// Load the current type
	view.on('init', function(next) {
		
			var q = keystone.list('ProductType').model.findOne(locals.data.product.category.type)
			
			q.exec(function(err, result) {
				locals.data.type = result;
				next(err);
			});
	});


	
	// Load other products
	view.on('init', function(next) {
		var q = keystone.list('Product').model.find()
			.where('type').in([locals.data.type])
			.limit('3')
			.sort('-state');
			
			q.exec(function(err, results) {
				locals.data.products = results;
				next(err);
			});
		});
	
	// Render the view
	view.render('product');
	
}
