$(function() {
    new Vue({
        el: '#app',
        delimiters: ['${', '}'],
        data: {
            client: {
                name: ''
            },
            transaction: null,
            operator: null,
            selectedStaffs: [],
            selectedServices: [],
            appoinment: 0,
            checkingPhone: false,
            step: 1,
            refreshTime: 0,
            timer: null,
            phone: '',
            phoneError: '',
            api: '',
            loading: false,
            systemError: false,
            retry: 0,
            retryLimit: 20
        },
        computed: {
            formatedPhone: function() {
                return this.mask(this.phone);
            }
        },
        methods: {
            mask: function(e) {
                var mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
                return vanillaTextMask.conformToMask(e, mask).conformedValue;
            },
            isValid: function(phone) {
                return phone.length === 10;
            },
            clearPhone: function() {
                this.phone = '';
            },
            keypress: function(i) {
                if (i === -1) {
                    this.phone = this.phone.slice(0, -1);
                } else {
                    if (this.isValid(this.phone)) {
                        return this.submitVerifyPhone();
                    } else {
                        this.phone += i;
                        if (this.isValid(this.phone)) {
                            return this.submitVerifyPhone();
                        }
                    }
                }
            },
            countdown: function() {
                var that = this;
                this.refreshTime = 10;
                this.timer = setInterval(function() {
                    if (that.refreshTime <= 0) {
                        clearInterval(that.timer);
                        that.refresh();
                    } else {
                        that.refreshTime -= 1;
                    }
                }, 1000);
            },
            submitVerifyPhone: function() {
                this.retry = 0;
                this.systemError = false;
                this.checkPhone();
            },
            checkPhone: function() {
                var that = this;
                this.checkingPhone = true;
                that.phoneError = '';
                $.ajax({
                    type: 'POST',
                    url: this.api + '/checkin/phone',
                    data: JSON.stringify({
                        phone: that.phone,
                        operatorId: this.operator._id
                    }),
                    contentType: 'application/json',
                    dataType: 'json'
                }).done(function(e) {
                    that.checkingPhone = false;
                    if (e.error) {
                        that.phoneError = e.error;
                    } else {
                        that.phoneError = '';
                        if (e.client) {
                            that.client = e.client;
                            if (e.transaction) {
                                that.transaction = e.transaction;
                                that.step = 6;
                                that.countdown();
                            } else {
                                that.step = 3;
                            }
                        } else {
                            that.client = {};
                            that.step = 2;
                        }
                    }
                }).fail(function() {
                    that.retry += 1;
                    if (that.retry < that.retryLimit) {
                        setTimeout(function() {
                            that.checkPhone();
                        }, 1000);
                    } else {
                        that.checkingPhone = false;
                        that.systemError = true;
                        that.phoneError = 'An error occurred, please try again or contact our staff';
                    }
                });
            },
            setName: function() {
                this.step = 3;
            },
            selectStaff: function(i) {
                this.$set(i, 'selected', !i.selected);
            },
            selectService: function(i) {
                this.$set(i, 'selected', !i.selected);
            },
            submitStaff: function() {
                this.selectedStaffs = this.operator.staffs.filter(function(e) {
                    return e.selected;
                });
                this.step = 5;
            },
            setAppointment: function(i) {
                this.appointment = i;
                this.step = 4;
            },
            back: function() {
                if (this.step === 3 && this.client._id) {
                    this.step -= 2;
                } else {
                    this.step -= 1;
                }
            },
            checkin: function() {
                var that = this;
                this.selectedServices = this.operator.services.filter(function(e) {
                    return e.selected;
                });
                this.selectedStaffs = this.selectedStaffs.map(function(e) {
                    return e._id;
                });
                this.selectedServices = this.selectedServices.map(function(e) {
                    return e._id;
                });
                this.loading = true;
                $.ajax({
                    type: 'POST',
                    url: this.api + '/checkin',
                    data: JSON.stringify({
                        phone: this.phone,
                        name: this.client.name,
                        staffs: this.selectedStaffs,
                        services: this.selectedServices,
                        appointment: this.appointment,
                        operatorId: this.operator._id
                    }),
                    contentType: 'application/json',
                    dataType: 'json'
                }).done(function(e) {
                    this.loading = false;
                    that.step = 6;
                    that.countdown();
                });
            },
            refresh: function() {
                window.location.href = '/';
            }
        },
        created: function() {
            this.operator = JSON.parse($('#operator').val());
            this.api = $('#api').val();
        }
    });
});

$(function() {
    var slides = $('.right-bg');
    $('.right-bg').slick({
        dots: false,
        arrows: false,
        slidesToShow: 1,
        infinite: true,
        speed: 500,
        fade: true,
        autoplay: true,
        autoplaySpeed: 15000,
        cssEase: 'linear'
    });
});
$(function() {
    FastClick.attach(document.body);
});