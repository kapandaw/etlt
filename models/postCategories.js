var keystone = require('keystone'),
	Types = keystone.Field.Types;

var PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 		'Категории блога',
	singular: 	'Категория блога',
	plural: 	'Категории блога'
});

PostCategory.add({
	name:          { label:'Категория', type: String, required: true, initial:true }
});

PostCategory.relationship({ ref: 'Post', path: 'categories' });
PostCategory.defaultColumns = 'name';
PostCategory.register();
