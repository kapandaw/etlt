var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Order = new keystone.List('Order', {
	nocreate: true,
	noedit: false,
	map: 	 { name: 'phone' },
	autokey: { path: 'slug', from: 'phone', unique: true },
	label: 		'Заказы',
	singular: 	'Заказ',
	plural: 	'Заказы',
	drilldown:  'products'
});

Order.add({
	products: { label:'Купленные товары', type: Types.Relationship, ref: 'Product', many: true, noedit: true },
	name: { label: 'Клиент', type: Types.Name, required: false, noedit: true },
	email: { label: 'Email', type: Types.Email, displayGravatar: true, required: false, noedit: true },
	phone: { label: 'Телефон', type: String, required: true, noedit: true},
	
	orderComment: { label: 'Комментарий', type: String, noedit: true, flag: 'description' },
	
	paymentType: { label: 'Способ оплаты', type: Types.Select, options: [
		{ value: 'Наличные', label: "Наличные" },
		{ value: 'Перевод-Приватбанк', label: "Перевод Приватбанк" }
	], noedit: true },
	
	deliveryType: { label: 'Способ доставки', type: Types.Select, options: [
		{ value: 'Курьер', label: "Курьер (Киев)" },
		{ value: 'Новая почта', label: "Новая почта (Украина)" }
	], noedit: true },
	deliveryCity: { label: 'Город', type: String , noedit: true},
	deliveryComment: { label: 'Комментарий доставки', type: String, noedit: true, flag: 'text-muted italic small' },
	
	totalCost: { label: 'Стоимость', type: Types.Money, format:'0,0.0 $', noedit: true },
	deliveryCost: { label: 'Стоимость доставки', type: Types.Money, noedit: true },
	grandTotalCost: { label: 'Итоговая стоимость', type: Types.Money, noedit: true },
	
	createdAt: { label: 'Получен', type: Date, default: Date.now, noedit: true, format:'DD.MM.YYYY hh:mm', flag:'date' },
	lockProducts: { label:'Покупка', type: Types.Html, wysiwyg: true, height: 400, noedit: true },
	status: { label: 'Статус', type: Types.Select, options: [
		{ value: 'new', label: "Новый", flag:'label label-warning order-status' },
		{ value: 'accepted', label: "Готов к отправке", flag:'label label-success order-status' },
		{ value: 'shipping-taxi', label: "Отправлен курьером", flag:'label label-primary order-status' },
		{ value: 'shipping-newmail', label: "Отправлен почтой", flag:'label label-primary order-status' },
		{ value: 'done', label: "Выполнен", flag:'label label-default order-status' }
	], default: 'new' },
	paymentChaeck: { label: 'Оплата получена', type: Boolean },
	numberNewMail: { label: 'Номер декларации', type: String },
	shopComment: { label: 'Комментарий магазина', type: String, flag: 'text-muted italic small' },
	
	doneDate: { label:'Выполнен',  type: Types.Date, index: true, dependsOn: { state: { value: 'done', label: "Выполнен" } }, default: Date.now, noedit: true }
	
});

Order.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
})

Order.schema.post('save', function() {
	if (this.wasNew) {
		this.NotifyOnGet();
	}
	this.NotifyOnAccept();
	this.NotifyOnSend();	
});

Order.schema.methods.NotifyOnGet = function(callback) {
	var order = this;

	new keystone.Email('order-notification-new').send({
		to: {
			name: order.name.first,
			email: order.email
		},
		from: {
			name: 'Дарья Овчинникова',
			email: 'dashamatsay@gmail.com'
		},
		subject: 'ETLT - Новый заказ',
		order: order
	}, callback);

	new keystone.Email('order-notification-new').send({
		to: {
			name: 'Дарья Овчинникова',
			email: 'dashamatsay@gmail.com'
		},
		from: {
			name: order.name.first,
			email: order.email
		},
		subject: 'ETLT - Получен новый заказ ',
		order: order
	}, callback);
}

Order.schema.methods.NotifyOnAccept = function(callback) {
	var order = this;

	if (order.status == 'accepted') {
		new keystone.Email('order-notification-accept').send({
			to: {
				name: order.name.first,
				email: order.email
			},
			from: {
				name: 'Дарья Овчинникова',
				email: 'dashamatsay@gmail.com'
			},
			subject: 'ETLT - Ваш заказ отправлен',
			order: order
		}, callback);
	}
}

Order.schema.methods.NotifyOnSend = function(callback) {
	var order = this;

	if (typeof(order.doneDate) != 'undefined' && order.doneDate != null) {
		if (order.numberNewMail != '') {
			new keystone.Email('order-notification-send').send({
				to: {
					name: order.name.first,
					email: order.email
				},
				from: {
					name: 'Дарья Овчинникова',
					email: 'dashamatsay@gmail.com'
				},
				subject: 'ETLT - Ваш заказ отправлен',
				order: order
			}, callback);
		}
	}
}

Order.defaultSort = '-createdAt';
Order.defaultColumns = 'status|100px, phone|120px, email|250px, name, totalCost|120px, deliveryCity|90px, orderComment, createdAt|110px';
Order.register();
