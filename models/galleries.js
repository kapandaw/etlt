var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Gallery = new keystone.List('Gallery', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 		'Галлереи',
	singular: 	'Галлерея',
	plural: 	'Галлереи'
});

Gallery.add({
	name:      { label:'Название', type: String, required: true, initial:true },
	heroImage: { label:'Обложка', type: Types.CloudinaryImage },
	images: { label:'Фотоки',type: Types.CloudinaryImages },
	publishedDate: { label:'Создан',type: Date, default: Date.now }
});

Gallery.defaultColumns = 'heroImage, name, publishedDate';
Gallery.register();
