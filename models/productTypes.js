var keystone = require('keystone'),
Types = keystone.Field.Types;

var ProductType = new keystone.List('ProductType', {
	autokey: { from: 'title', path: 'key', unique: true },
    map: { name: 'title' },
	label: 		'Типы товаров',
	singular: 	'Тип товара',
	plural: 	'Типы товаров'
});

ProductType.add({
	title: { label:'Тип', type: String, required: true, initial:true },
	description: { label:'Описание раздела', type: Types.Html, wysiwyg: true, required: true, initial:true }
});

ProductType.relationship({ ref: 'Product', path: 'type' });
ProductType.relationship({ ref: 'ProductCategory', path: 'type' });

ProductType.defaultColumns = 'title, description';
ProductType.register();
