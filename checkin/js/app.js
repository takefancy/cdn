$(function() {
    new Vue({
        el: '#app',
        delimiters: ['${', '}'],
        data: {
            client: {
                name: ''
            },
            operator: null,
            selectedStaffs: [],
            selectedServices: [],
            appoinment: 0,
            checkingPhone: false,
            step: 1,
            refreshTime: 0,
            timer: null,
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
            clearPhone: function() {
                this.phone = '';
            },
            keypress: function(i) {
                if (i === -1) {
                    this.phone = this.phone.slice(0, -1);
                } else {
                    if (this.isValid(this.phone)) {
                        return this.checkPhone();
                    } else {
                        this.phone += i;
                        if (this.isValid(this.phone)) {
                            return this.checkPhone();
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
            checkPhone: function() {
                var that = this;
                this.checkingPhone = true;
                $.ajax({
                    type: 'POST',
                    url: '/checkin/phone',
                    data: JSON.stringify({
                        phone: that.phone
                    }),
                    contentType: 'application/json',
                    dataType: 'json'
                }).done(function(e) {
                    that.checkingPhone = false;
                    if (e.client) {
                        that.client = e.client;
                        that.step = 3;
                    } else {
                        that.client = {},
                            that.step = 2;
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
                if (i) {
                    this.step = 4;
                } else {
                    this.step = 5;
                }
            },
            back: function() {
                if (this.step === 5 && !this.appointment || this.step === 3 && this.client._id) {
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
                $.ajax({
                    type: 'POST',
                    url: '/checkin',
                    data: JSON.stringify({
                        phone: this.phone,
                        name: this.client.name,
                        staffs: this.selectedStaffs,
                        services: this.selectedServices,
                        appointment: this.appointment
                    }),
                    contentType: 'application/json',
                    dataType: 'json'
                }).done(function(e) {
                    that.step = 6;
                    that.countdown();
                });
            },
            refresh: function() {
                window.location.href = '/checkin';
            }
        },
        created: function() {
            this.operator = JSON.parse($('#operator').val());
        }
    });
});