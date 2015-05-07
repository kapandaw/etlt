var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	label: 		'Посты',
	singular: 	'Пост',
	plural: 	'Посты'
});

Post.add({
	title: 		{ label:'Заглавие', type: String, required: true, initial:true },
	state: 		{ label:'Статус', type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { label:'Автор', type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { label:'Дата публикации',  type: Types.Date, index: true, dependsOn: { state: 'published' }, default: Date.now },
	categories: { label:'Категории', type: Types.Relationship, ref: 'PostCategory', many: true },
	image: {label:'Обложка',  type: Types.CloudinaryImage },
	content: {
		brief: {label:'Начало поста',  type: Types.Markdown, toolbarOptions: { hiddenButtons: 'H5,H6' }, height: 150 },
		extended: {label:'Текст поста',  type: Types.Markdown, toolbarOptions: { hiddenButtons: 'H5,H6' }, height: 350 }
	}
});

Post.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
