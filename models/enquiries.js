var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true,
	label: 		'Сообщения',
	singular: 	'Сообщение',
	plural: 	'Сообщения'

});

Enquiry.add({
	name:  { label:'Имя отправителя', type: Types.Name, required: true },
	email: { label:'Email отправителя', type: Types.Email, required: true },
	phone: { label:'Телефон отправителя', type: String },
	enquiryType: { label:'Тип сообщения', type: Types.Select, options: [
		{ value: 'zakaz', label: "Вопрос о заказе" },
		{ value: 'shipping-payment', label: "Вопрос о доставке/оплате" },
		{ value: 'partnership', label: "Предложение сотрудничества" },
		{ value: 'other', label: "Другое.." }
	] },
	message: { label:'Сообщение', type: Types.Markdown, required: true },
	createdAt: { label:'Получено', type: Date, default: Date.now }
});

Enquiry.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
})

Enquiry.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function(callback) {
	var enqiury = this;
	new keystone.Email('enquiry-notification').send({
		to: {
			name: 'Дарья Овчинникова',
			email: 'dashamatsay@gmail.com'
		},
		from: {
			name: this.name.first,
			email: this.email
		},
		subject: 'ETLT - Новое сообщение от клиента',
		enquiry: enqiury
	}, callback);
}

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
