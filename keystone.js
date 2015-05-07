// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone'),
    i18n = require("i18n");

keystone.init({
    'wysiwyg override toolbar': false,
    'wysiwyg menubar': true,
    'wysiwyg skin': 'lightgray',
    'wysiwyg additional buttons': 'searchreplace visualchars,'
     + ' charmap ltr rtl pagebreak paste, forecolor backcolor,'
     +' emoticons media, preview print ',
    'wysiwyg additional plugins': 'example, table, advlist, anchor,'
     + ' autolink, autosave, bbcode, charmap, contextmenu, '
     + ' directionality, emoticons, fullpage, hr, media, pagebreak,'
     + ' paste, preview, print, searchreplace, textcolor,'
     + ' visualblocks, visualchars, wordcount',

    'name': 'ETLT',
    'brand': 'ETLT',

 

    'less': 'public',
    'static': 'public',
    'favicon': 'public/favicon.ico',
    'views': 'templates/views',
    'view engine': 'jade',

    'emails': 'templates/emails',

    'auto update': false,
    'session': true,
    'auth': true,
    'user model': 'User',
    'cookie secret': 'ng0cO<"5@?[CN)k&^D0W0eb#{Oyffn2PZaE1"{==Xnamihq.^J+*PqP7_Z&4mx_5'

});

keystone.import('models');

keystone.set('locals', {
    _: require('underscore'),
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable
});

// Configure i18n
 
i18n.configure({
    locales:['en', 'ru', 'ua'],
    defaultLocale: 'ua',
    directory: __dirname + '/locales',
    // sets a custom cookie name to parse locale settings from  - defaults to NULL
    cookie: 'locale'
});

keystone.set('routes', require('./routes'));

keystone.set('email locals', {
    logo_src: '/images/logo-email.gif',
    logo_width: 194,
    logo_height: 76,
    theme: {
        email_bg: '#f9f9f9',
        link_color: '#2697de',
        buttons: {
            color: '#fff',
            background_color: '#2697de',
            border_color: '#1a7cb7'
        }
    }
});

keystone.set('email rules', [{
    find: '/images/',
    replace: (keystone.get('env') == 'production') ? 'http://www.etlt.com.ua/images/' : 'http://localhost:3000/images/'
}, {
    find: '/keystone/',
    replace: (keystone.get('env') == 'production') ? 'http://www.etlt.com.ua/keystone/' : 'http://localhost:3000/keystone/'
}]);

keystone.set('email tests', require('./routes/emails'));

keystone.set('nav', {
    'Магазин украшений': ['products', 'product-categories', 'orders'],
    'Сообщения': 'enquiries',
    'Блог': ['posts', 'post-categories'],
    'Галерея': 'galleries'
});

keystone.start();
