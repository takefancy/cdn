$(function() {
    function mask(e) {
        var mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
        return vanillaTextMask.conformToMask(e, mask).conformedValue;
    }
    $('#txtPhone').html(mask(''));
    let Keyboard = window.SimpleKeyboard.default;
    let keyboard = new Keyboard({
        maxLength: 10,
        onChange: function(number) {
            // var mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
            // number = vanillaTextMask.conformToMask(number, mask).conformedValue;
            number = mask(number);
            $('#txtPhone').html(number);
            if (number && number.indexOf('_') < 0) {
                checkin();
            }
        },
        onKeyPress: function(e) {
            if (e === '{enter}') {
                checkin();
            }
        },
        layout: {
            default: ["1 2 3", "4 5 6", "7 8 9", "{bksp} 0 {enter}"]
        },
        theme: "hg-theme-default hg-layout-numeric numeric-theme"
    });

    var show = function(e) {
            $(e).removeClass('toshow').addClass('animated fadeIn fast');
        },
        hide = function(e) {
            $(e).addClass('animated fadeOut fast').addClass('toshow');
        };
    $('#btnCheckin').click(checkin);

    function checkin() {
        show('#screenDetails');
        hide('#screenPhone');
        return;
        show('#spin');
        hide('#keyboard');
        var phone = $('#txtPhone').html(),
            name = $('#txtName').val();
        $.ajax({
            type: 'POST',
            url: '/checkin',
            data: JSON.stringify({
                phone: phone,
                name: name
            }),
            contentType: "application/json",
            dataType: 'json'
        }).done(function(e) {
            if (e.requireName) {
                hide('#spin');
                show('#nameInput');
            } else if (e.success) {
                hide('#nameInput');
                $('#operator').html(e.operator);
                $('#order').html('#' + e.order);
                $('#name').html(name || e.name);
                show('#welcome');
                hide('#spin');
            }

        });
    }
});