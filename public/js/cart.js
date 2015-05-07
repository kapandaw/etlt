var urlBase = 'http://www.etlt.com.ua';
simpleCart({
    cartColumns: [{
            view: "image",
            attr: 'thumb',
            label: false
        }, {
            attr: "name",
            label: 'Название'
        }, {
            view: "",
            attr: "code",
            label: '',
            className: 'hidden'
        }, {
            view: "",
            attr: "key",
            label: '',
            className: 'hidden'
        },
        //- {view:'link',               attr: 'pageLink',   label: ' '},
        {
            view: "money",
            attr: "price",
            label: 'Цена'
        }, {
            view: "decrement",
            label: false
        }, {
            view: "input",
            attr: "quantity",
            label: 'Кол-во'
        }, {
            view: "increment",
            label: false
        }, {
            view: "currencyAfter",
            attr: "total",
            label: 'Итого'
        }, {
            view: "remove",
            text: " ",
            label: false
        }
    ],
    cartStyle: "div",
    checkout: {
        type: "SendForm",
        url: urlBase + "/checkout",
        method: "Post",
        success: null,
        cancel: null,
        extra_data: {
            storename: "ETLT.com.ua store",
            cartid: "55791634"
        }
    },
    currency: "UAH",
    data: {},
    language: "russian-ru",
    excludeFromCheckout: [],
    shippingCustom: function() {
        var elem = $("#shippingType");
        if (typeof(elem) != 'undefined' && elem != null) {
            var shippingType = elem.val();
            if (shippingType === 'taxi') {
                return 50;
            } else if (shippingType === 'newmail') {
                return 30;
            } else {
                return 0;
            }
        }
        return 0;
    },
    shippingFlatRate: 0,
    shippingQuantityRate: 0,
    shippingTotalRate: 0,
    taxRate: 0,
    taxShipping: false
});

$('.item_order').on('click', function() {
    var id = $(this).attr("data-item-id");
    var name = $(this).attr("data-item-name");
    var code = $(this).attr("data-item-code");
    var price = $(this).attr("data-item-price");
    var thumb = $(this).attr("data-item-thumb");
    var order = "<table class='pure-table' border='1' cellspacing='0' cellpadding='6'><thead><tr><th></th><th>Код</th><th>Название</th><th>Цена</th></tr></thead><tr><td><img class='img-thumbnail' src='" + thumb + "'</td><td>" + code + "</td><td>" + name + "</td><td>от " + price + " грн</td></tr></table>";

    vex.dialog.open({
        message: '<div class="text-left lead"><strong>Заказ на изготовление украшения</strong></div>',
        input: '<input type="hidden" name="action" value="personal">\n<div class="text-center"><img class="order-item-thumb" src="' + thumb + '"/><div class="order-item-code">' + code + '</div><div class="order-item-name">' + name + '</div><div class="text-center"><span class="order-item-small">от</span><span class="order-item-price"> ' + price + '</span><span class="order-item-small"> грн</span></div></div>\n<input type="hidden" style="display:none" name="product" value="' + id + '" >\n<input type="hidden" style="display:none" name="order" value="' + order + '" >\n<input name="name" type="text" placeholder="Ваше имя" required >\n<input name="email" type="email" placeholder="Ваш email" required >\n<input name="phone" type="text" placeholder="Ваш телефон" required >\n<textarea name="comment" type="text" placeholder="Напишите ваши пожелания к заказу" rows=8 required >',
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
                text: 'Заказать'
            })
        ],
        callback: function(data) {
            if (data === false) {
                return console.log('Нет данных для отправки заказа. Отмена');
            }
            $form = $(document).find(".vex-dialog-form");
            $actioninput = $form.find("input[name='action']");
            $action = $actioninput.val();

            var posting = $.post('shop', data)
                .done(function() {
                    return vex.dialog.alert("Ваш заказ успешно отправлен");
                })
                .fail(function() {
                    return vex.dialog.alert("Произошла ошибка при отправке заказа");
                });
        }
    });
});