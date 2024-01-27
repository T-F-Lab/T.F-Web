$(document).ready(function(){
    var original = $('.project_item_in').html();
    $('.project_item_in').html('');
    var html = $('<html />').html(original).text();
    $('.project_item_in').append(html);
    $('.project_item_in').removeClass('load');

    /*$.getJSON(window.location.href+'?get=html', function(data){
        var html = $('<html />').html(data[0]).text();
        $('.project_item_in').append(html);
    });*/
});