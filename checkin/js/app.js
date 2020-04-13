$(function() {
    var step = 1,
        name = '',
        appointment = true,
        staffs = [],
        services = [];

    function mask(e) {
        var mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
        return vanillaTextMask.conformToMask(e, mask).conformedValue;
    }
    $('#txtPhone').html(mask(''));
    var keyboard = new window.SimpleKeyboard.default({
        maxLength: 10,
        onChange: function(number) {
            number = mask(number);
            $('#txtPhone').html(number);
            if (number && number.indexOf('_') < 0) {
                checkPhone();
            }
        },
        onKeyPress: function(e) {
            // if (e === '{enter}') {
            //     checkin();
            // }
        },
        layout: {
            default: ["1 2 3", "4 5 6", "7 8 9", "{bksp} 0 {enter}"]
        },
        theme: "hg-theme-default hg-layout-numeric numeric-theme"
    });

    var show = function(e, effect) {
            effect = effect || 'rotateInUpLeft';
            $(e).removeClass('toshow').addClass(effect + ' animated fast');
        },
        hide = function(e, effect) {
            effect = effect || 'rotateOutUpLeft';
            $(e).addClass(effect + ' animated fast').addClass('toshow');
        };

    function checkPhone() {
        $.ajax({
            type: 'POST',
            url: '/checkin/phone',
            data: JSON.stringify({
                phone: $('#txtPhone').html()
            }),
            contentType: "application/json",
            dataType: 'json'
        }).done(function(e) {
            if (e.new) {
                goto(2);
            } else {
                goto(3);
            }
        });
    }

    $('#btnSubmitName').click(function() {
        name = $('#txtName').val();
        if (name) {
            goto(3);
        } else {
            show('#nameError', 'fadeIn');
        }
    });

    $('#btnAppointment').click(function() {
        appointment = true;
        goto(4);
    });

    $('#btnWalkins').click(function() {
        appointment = false;
        goto(5);
    });

    $('#btnSubmitStaffs').click(function() {
        $('.staff.clicked').each(function(e) {
            staffs.push($(this).html())
        });
        console.log(staffs);
        goto(5);
    });

    $('#btnSubmitServices').click(function() {
        $('.service-item.active h5').each(function(e) {
            services.push($(this).html())
        });
        var phone = $('#txtPhone').html(),
            name = $('#txtName').val();
        $.ajax({
            type: 'POST',
            url: '/checkin',
            data: JSON.stringify({
                phone: phone,
                name: name,
                staffs: staffs,
                services: services,
                appointment: appointment
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
    });

    $('.staff').click(function() {
        $(this).toggleClass('clicked');
    });

    $('.service-item').click(function() {
        $(this).toggleClass('active');
    });

    function goto(e) {
        hide('#step' + step);
        step = e;
        show('#step' + step);
    }
});