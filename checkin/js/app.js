$(function() {
    var step = 1,
        client = null,
        name = '',
        appointment = true,
        staffs = [],
        services = [];
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
            if (e.client) {
                client = e.client;
                goto(3);
            } else {
                goto(2);
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
    new Vue({
        el: '#app',
        delimiters: ['${', '}'],
        data: {
            client: {
                name: ''
            },
            appoinment: 0,
            step: 1,
            phone: ''
        },
        computed: {
            formatedPhone: function() {
                return this.mask(this.phone);
            }
        },
        methods: {
            mask: function(e) {
                var mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
                return vanillaTextMask.conformToMask(e, mask).conformedValue;
            },
            isValid: function(phone) {
                return phone.length === 10;
            },
            keypress: function(i) {
                if (i === -1) {
                    this.phone = this.phone.slice(0, -1);
                } else {
                    this.phone += i;
                }
                if (this.isValid(this.phone)) {
                    this.checkPhone();
                }
            },
            checkPhone: function() {
                var that = this;
                $.ajax({
                    type: 'POST',
                    url: '/checkin/phone',
                    data: JSON.stringify({
                        phone: that.phone
                    }),
                    contentType: "application/json",
                    dataType: 'json'
                }).done(function(e) {
                    if (e.client) {
                        that.client = e.client;
                        that.step = 3;
                    } else {
                        that.step = 2;
                    }
                });
            },
            setName: function() {
                this.step = 3;
            },
            setAppointment: function(i) {
                this.appoinment = i;
                if (i) {
                    this.step = 4;
                } else {
                    this.step = 5;
                }
            }
        },
        created: function() {}
    });
});