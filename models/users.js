var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Users
 * =====
 */

var User = new keystone.List('User',{
	label: 		'Пользователи',
	singular: 	'Пользователь',
	plural: 	'Пользователи'
});

User.add({
	name:     { label: 'Полное имя', type: Types.Name, required: true, index: true },
	email:    { label: 'Email', type: Types.Email, displayGravatar: true, initial: true, required: true, index: true },
	password: { label: 'Пароль', type: Types.Password, initial: true, required: false }
}, 'Permissions', {
	isAdmin: { label:'Являеться админом', type: Boolean, label: 'Can access Keystone' }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
