function time(a){
    $.getJSON('/upload/get/time?time='+a.text()+'&format=%y/%m/%d', function(data) {
        a.text(data);
    });
}

$(document).ready(function(){
    $('.time').each(function() {
        time($(this));
    });
});

$('.item').on('click','.delete', function(e){
    var $target = $(e.target);
    if(confirm("삭제하면 복구할수 없습니다.\n그래도 삭제 하시겠습니까?")){
        location.href = "/upload/delete_file?id="+$target.attr('data-id');
    }else{
    }
});