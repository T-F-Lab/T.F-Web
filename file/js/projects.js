const $names = {};
var $len = 0;

function time(a){
    $.getJSON('/upload/get/time?time='+a.text()+'&format=%y/%m/%d', function(data) {
        a.text(data);
        a.css('visibility', 'visible');
    });
}

$(document).ready(function(){
    $('.p_time').each(function() {
        time($(this));
    });
    const list = [];
    $('.p_author').each(function() {
        if (!(list.includes($(this).text()))){
            list.push($(this).text());
        }
    })
    console.log(list);
    var i;
    for (i=0; i<list.length; i++){
        $.getJSON('/upload/get/author?id='+list[i], function(data) {
            $names[data[0]] = data[1];
            $len += 1;
            if ($len == list.length) {
                $('.p_author').each(function(){
                    $(this).text($names[Number($(this).text())]);
                });
            }
        });
    }
});