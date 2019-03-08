$(function () {
    $('#from').datetimepicker({
        format: 'DD MM YYYY'

    });
});

$(function () {
    $('#thru').datetimepicker({
        format: 'DD MM YYYY'
    });
});




// FLEXSLIDER INIT

$('.wohnung-1').flexslider({
    controlNav: false,
});
$('.wohnung-2').flexslider({
    controlNav: false,
    itemWidth: 300,
    itemHeight: 400
});
$('.wohnung-3').flexslider({
    controlNav: false,
});
$('.wohnung-4').flexslider({
    controlNav: false,
});
$('.wohnung-5').flexslider({
    controlNav: false,
});


// FANCYBOX INIT
$("a[data-fancy=group1]").fancybox({
    'transitionIn': 'none',
    'transitionOut': 'none',
    'titlePosition': 'over',
    'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
        return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
    }
});

$("a[data-fancy=group2]").fancybox({
    'transitionIn': 'none',
    'transitionOut': 'none',
    'titlePosition': 'over',
    'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
        return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
    }
});

$("a[data-fancy=group3]").fancybox({
    'transitionIn': 'none',
    'transitionOut': 'none',
    'titlePosition': 'over',
    'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
        return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
    }
});

$("a[data-fancy=group4]").fancybox({
    'transitionIn': 'none',
    'transitionOut': 'none',
    'titlePosition': 'over',
    'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
        return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
    }
});

$("a[data-fancy=group5]").fancybox({
    'transitionIn': 'none',
    'transitionOut': 'none',
    'titlePosition': 'over',
    'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
        return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
    }
});

function initMap() {
    var uluru = { lat: 54.9353248, lng: 8.322018299999968 };
    var map = new google.maps.Map(document.getElementsByClassName('mapContainer')[0], {
        zoom: 16,
        center: uluru,
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [
                    { "visibility": "off" }
                ]
            }
        ]
    });
    https:
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });

};

/* Google Analytics: change UA - XXXXX - X to be your site's ID. */
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-48940312-1', 'auto');
ga('send', 'pageview');

