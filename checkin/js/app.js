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
                    contentType: 'application/json',
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
                if (this.selectedStaffs && this.selectedStaffs.length > 0) {
                    this.step = 5;
                }
            },
            setAppointment: function(i) {
                this.appointment = i;
                if (i) {
                    this.step = 4;
                } else {
                    this.step = 5;
                }
            },
            checkin: function() {
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

                });
            }
        },
        created: function() {
            this.operator = JSON.parse($('#operator').val());
        }
    });
});