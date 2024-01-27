$('.title_input').change(function(){
    $('.p_title').text($('.title_input').val());
    if ($('.title_input').val() == "") $('.p_title').text("제목을 입력해 주세요.");
});

$('.window1').change(function() {
    if ($('.window1').is(":checked")) {
        $('.image_upload').css('backgroundColor', 'rgb(60, 55, 60)');
        $('.image_uploader').css('visibility', 'visible');
        $('.image_uploader').css('z-index', '7');
    } else {
        $('.image_upload').css('backgroundColor', 'rgb(40, 35, 40)');
        $('.image_uploader').css('visibility', 'hidden');
        $('.image_uploader').css('visibility', '');
        $('.image_uploader').css('z-index', '');
    }
});

$(window).on('beforeunload', function(){
    return "종료시 데이터는 저장되지 않습니다.";
});