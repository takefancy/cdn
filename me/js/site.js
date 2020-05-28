(function(d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');
window.fbAsyncInit = function() {
    FB.init({
        appId: '658018328102226',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v6.0'
    });
};

$(function() {
    setTimeout(function(){
        $('#nav').removeClass('d-none');
    }, 1000);

    $('.select2').each(function() {
        $(this).select2();
    });

    $('.from-now').each(function(e) {
        var date = $(this).attr('data-date');
        var format = moment(date, 'YYYY-MM-DD hh:mm A').fromNow();
        $(this).html(format);
    });

    $('.rolldate').each(function() {
        var el = $(this)[0];
        var format = $(el).attr('data-format') || 'YYYY-MM-DD';
        var title = $(el).attr('data-title') || 'Select a date';
        new Rolldate({
            el: el,
            format: format,
            beginYear: 1920,
            endYear: 2020,
            lang: {
                title: title,
                cancel: 'Cancel',
                confirm: 'Confirm',
                year: '',
                month: '',
                day: '',
                hour: '',
                min: '',
                sec: ''
            }
        });
    });

    $('#appointmentTime').daterangepicker({
        timePicker: true,
        singleDatePicker: true,
        drops: 'up',
        startDate: moment().add(1, 'days').set({
            'hour': 10,
            'minute': 0
        }),
        timePickerIncrement: 15,
        locale: {
            format: 'YYYY/MM/DD hh:mm A'
        }
    });

    $('#btnLoginFb').click(function() {
        var me = function() {
            FB.api('/me?fields=id,name,email,gender,birthday', function(res) {
                $.ajax({
                    type: 'POST',
                    url: '/update-profile/' + $('#clientId').val(),
                    data: JSON.stringify({
                        fbId: res.id,
                        email: res.email,
                        dob: res.birthday,
                        gender: res.gender
                    }),
                    contentType: 'application/json'
                }).done(function(e) {
                    window.location.reload();
                });
            });
        };
        FB.getLoginStatus(function(x) {
            if (!x.authResponse) {
                FB.login(function(res) {
                    me();
                }, {
                    scope: 'public_profile,email,user_gender,user_birthday'
                });
            } else {
                me();
            }
        });
    });

    $('#btnSubmitProfile').click(function() {
        var name = $('#txtName').val();
        var email = $('#txtEmail').val();
        var dob = $('#txtDob').val();
        var data = {};
        if (name) {
            data.name = name;
        }
        if (email) {
            data.email = email;
        }
        if (dob) {
            data.dob = dob;
        }
        $.ajax({
            type: 'POST',
            url: '/update-profile/' + $('#clientId').val(),
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).done(function(e) {
            window.location.reload();
        });
    });

    $('#btnSubmitAppointment').click(function() {
        var staffs = $('#ddlStaffs').val(),
            services = $('#ddlServices').val(),
            date = $('#appointmentTime').val(),
            note = $('#appointmentNote').val(),
            bookError = '';
        if (!date) {
            bookError = 'Please select booking time';
        }
        if (bookError) {
            $('#bookError').html(bookError);
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/profile/book/' + $('#clientId').val(),
            data: JSON.stringify({
                staffs: staffs,
                services: services,
                date: new Date(date),
                note: note
            }),
            contentType: 'application/json'
        }).done(function(e) {
            window.location.reload();
        });
    });


    $('.btn-cancel-appointment').click(function() {
        var id = $(this).attr('data-id');
        if (id) {
            $.ajax({
                type: 'POST',
                url: '/update-appointment/' + id,
                data: JSON.stringify({
                    canceled: new Date()
                }),
                contentType: 'application/json'
            }).done(function(e) {
                window.location.reload();
            });
        }
    });

    $('.me-review-rate').click(function() {
        var transactionId = $('#transactionId').val();
        var rate = $(this).attr('data-rate');
        if (transactionId) {
            $.ajax({
                type: 'POST',
                url: '/update-transaction/' + transactionId,
                data: JSON.stringify({
                    clientRate: +rate
                }),
                contentType: 'application/json'
            }).done(function(e) {
                window.location.reload();
            });
        }
    });

    function updateFeedback() {
        var transactionId = $('#transactionId').val();
        var message = $('#txtNeutralFeedback').val() || $('#txtAngryFeedback').val();
        if (transactionId) {
            $.ajax({
                type: 'POST',
                url: '/update-transaction/' + transactionId,
                data: JSON.stringify({
                    clientFeedback: message
                }),
                contentType: 'application/json'
            }).done(function(e) {
                window.location.reload();
            });
        }
    }

    $('#btnSubmitNeutralFeedback').click(function() {
        updateFeedback();
    });

    $('#btnSubmitAngryFeedback').click(function() {
        updateFeedback();
    });

});