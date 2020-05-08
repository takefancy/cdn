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
    $('.rolldate').each(function() {
        var format = $(this).attr('data-format') || 'YYYY-MM-DD';
        var title = $(this).attr('data-title') || 'Select a date';
        new Rolldate({
            el: $(this),
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
});