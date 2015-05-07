var keystone = require('keystone'),
	Types = keystone.Field.Types;

var PersonalOrder = new keystone.List('PersonalOrder', {
	nocreate: false,
	noedit: false,
	map: 	 { name: 'phone' },
	autokey: { path: 'slug', from: 'phone', unique: true },
	label: 		'Индивидуальные заказы',
	singular: 	'Индивидуальный заказ',
	plural: 	'Индивидуальные заказы',
	drilldown:  'product'
});

PersonalOrder.add({
	product: { label:'Купленные товары', type: Types.Relationship, ref: 'Product', many: false, noedit: true },
	name: { label: 'Клиент', type: Types.Name, required: false, noedit: true },
	email: { label: 'Email', type: Types.Email, displayGravatar: true, required: false, noedit: true },
	phone: { label: 'Телефон', type: String, required: true, noedit: true},
	comment: { label: 'Комментарий', type: String, noedit: true, flag: 'description' },
	order: { label:'Заказ', type: Types.Html, wysiwyg: true, height: 400, noedit: true },
	createdAt: { label: 'Получен', type: Date, default: Date.now, noedit: true, format:'DD.MM.YYYY hh:mm', flag:'date' },

	status: { label: 'Статус', type: Types.Select, options: [
		{ value: 'new', label: "Новый", flag:'label label-warning order-status' },
		{ value: 'accepted', label: "Готов к отправке", flag:'label label-success order-status' },
		{ value: 'shipping-taxi', label: "Отправлен курьером", flag:'label label-primary order-status' },
		{ value: 'shipping-newmail', label: "Отправлен почтой", flag:'label label-primary order-status' },
		{ value: 'done', label: "Выполнен", flag:'label label-default order-status' }
	], default: 'new' },
	totalCost: { label: 'Стоимость', type: Types.Money, format:'0,0.0 $' },
	comment: { label: 'Комментарий', type: String, flag: 'text-muted italic small' },
	numberNewMail: { label: 'Номер декларации', type: String },
	doneDate: { label:'Выполнен',  type: Types.Date, index: true, dependsOn: { state: { value: 'done', label: "Выполнен" } }, default: Date.now, noedit: true }
});

PersonalOrder.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
})

PersonalOrder.schema.post('save', function() {
	if (this.wasNew) {
		this.NotifyOnGet();
	}
});

PersonalOrder.schema.methods.NotifyOnGet = function(callback) {
	var order = this;

	new keystone.Email('p-order-notification-new').send({
		to: {
			name: order.name.first,
			email: order.email
		},
		from: {
			name: 'Дарья Овчинникова',
			email: 'dashamatsay@gmail.com'
		},
		subject: 'ETLT - Получен новый заказ',
		order: order
	}, callback);

	new keystone.Email('p-order-notification-new').send({
		to: {
			name: 'Дарья Овчинникова',
			email: 'dashamatsay@gmail.com'
		},
		from: {
			name: order.name.first,
			email: order.email
		},
		subject: 'ETLT - Новый персональный заказ получен',
		order: order
	}, callback);
}

PersonalOrder.defaultSort = '-createdAt';
PersonalOrder.defaultColumns = 'status|100px, phone|120px, email|250px, name, totalCost|120px, comment, createdAt|110px';
PersonalOrder.register();
