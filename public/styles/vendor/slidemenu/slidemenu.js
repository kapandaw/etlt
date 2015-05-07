$(document).ready(function() {
    var menuRight = document.getElementById('cbp-spmenu-s2'),
        showRightPush = document.getElementById('showRightPush'),
        closeRightPush = document.getElementById('closeRightPush'),
        fade = document.getElementById('fade'),
        body = document.body;

    showRightPush.onclick = function() {
        classie.toggle(this, 'active');
        classie.toggle(body, 'cbp-spmenu-push-toleft');
        classie.toggle(menuRight, 'cbp-spmenu-open');
        fade.classList.remove('hidden')
        disableOther('showRightPush');
    };

    function disableOther(button) {
        if (button !== 'showRightPush') {
            classie.toggle(showRightPush, 'disabled');
        }
    }

    closeRightPush.onclick = function() {
        menuRight.classList.remove('active');
        menuRight.classList.remove('cbp-spmenu-push-toleft');
        menuRight.classList.remove('cbp-spmenu-open');
        fade.classList.add('hidden')
    };


});

function resize() {
    $('#navbar-main').autowidth();
    var width = $(window).width();
    var cart = $('#cart');
    var cartContainer = $('#cart-container');
    var cartRightContainer = $('#cart-container-right');
    if (typeof(cart) != 'undefined' && cart != null) {
        if (width > 767) {
            if (typeof(cartContainer) != 'undefined' && cartContainer != null) {
                var menuRight = document.getElementById('cbp-spmenu-s2');
                fade = document.getElementById('fade');
                menuRight.classList.remove('active');
                menuRight.classList.remove('cbp-spmenu-push-toleft');
                menuRight.classList.remove('cbp-spmenu-open');
                fade.classList.add('hidden')
                cart.appendTo(cartContainer);
            }
        } else {
            if (typeof(cartRightContainer) != 'undefined' && cartRightContainer != null) {
                cart.appendTo(cartRightContainer);
            }
        }
    }
};

