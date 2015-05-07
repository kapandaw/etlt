var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Product = new keystone.List('Product', {
    map:     { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true },
    label:      'Товары',
    singular:   'Товар',
    plural:     'Товары',
    drilldown:  'category',
    drilldown:  'type'
});

Product.add({

    title: { label:'Название', type: String, required: true, initial:true },
    code:  { label:'Код', type: String, required: true, initial:true, flag:"label label-default small" },
    type:       { label:'Тип', type: Types.Relationship, ref: 'ProductType', many: false, index: true, initial:true },
    category:       { label:'Категория', type: Types.Relationship, ref: 'ProductCategory', many: false, index: true, initial:true, filters: { type: ':type' } },
    state:          { label:'Статус',       type: Types.Select, 
            options: 
                [
                    { value: 'exist', label: "В наличии", flag:'label label-success product-status' },
                    { value: 'order', label: "Под заказ", flag:'label label-default product-status' },
                    { value: 'sample', label: "Для примера", flag:'label label-primary product-status' }
                ],
            default: 'order', index: true, initial:true },
    Indicator:      { label:'Ярлык',    type: Types.Select, initial:true, options: [
                                                                            { value: 'indicator-topsales', label: 'Топ продаж', flag:'text-primary lead tag' }, 
                                                                            { value: 'indicator-discount', label: 'Акция', flag:'text-danger lead tag' }, 
                                                                            { value: 'indicator-sale', label: 'Дисконт', flag:'text-warning lead tag' }, 
                                                                            { value: 'indicator-gift', label: 'Подарок', flag:'text-success lead tag' }
                                                                        ], index: true, many:false, initial:true },
    
    TM:             { label:'Брэнд',    type: Types.Select, options: 'ETLT', default: 'ETLT', many: false,  initial:true },
    
    image:          { label:'Фото',   type: Types.CloudinaryImage, autoCleanup : true, select: true, folder: 'products', selectPrefix: 'products/first', publicID: 'slug' },
    images:         { label:'Еще фото', type: Types.CloudinaryImages, autoCleanup : true },
    
    price: {
        common:     { label:'Цена', type: Types.Money, format:'0,0.0 $', required: false, initial:true },
        sale:       { label:'Скидка', type: Types.Money, format:'0,0.0 $', required: false }
    },

    content: { label:'Описание товара',     type: Types.Html, wysiwyg: true, height: 150, initial:true },
    createdAt: { label:'Добавлен', type: Date, default: Date.now }

});

Product.schema.virtual('price_common').get(function() { return this.price.common; });
Product.schema.virtual('price_sale').get(function() { return this.price.sale; });

Product.relationship({ ref: 'Order', path: 'products' });
Product.relationship({ ref: 'PersonalOrder', path: 'product' });

// Product.defaultColumns = 'title, state|20%';
Product.defaultColumns = 'code|70px, image|80px, title|70%, TM|100px, state|110px, Indicator|130px, price.common|100px, price.sale|100px';
Product.register();
