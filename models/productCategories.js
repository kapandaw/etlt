var keystone = require('keystone'),
Types = keystone.Field.Types;

var ProductCategory = new keystone.List('ProductCategory', {
	autokey: { from: 'title', path: 'key', unique: true },
	map: { name: 'title' },
    label: 		'Категории товаров',
	singular: 	'Категория товара',
	plural: 	'Категории товаров',
    drilldown:  'type'
});

ProductCategory.add({
	title: { label:'Категория', type: String, required: true, initial:true },
    type:  { label:'Тип', type: Types.Relationship, ref: 'ProductType', many: false, index: true, initial:true, required: false },
});

ProductCategory.relationship({ ref: 'Product', path: 'category' });
ProductCategory.defaultColumns = 'title, type';
ProductCategory.register();
