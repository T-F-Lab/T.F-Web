$('.form').on('click','.share', function(e){
    $target = $(e.target);
    $('.blur, .share_dialog').removeClass('hidden');
    $('.share_dialog h3').text('Test Dialog');
    $('.share_dialog p').text('Forms을 공유하기');
    $('.share_dialog a').text(window.location.origin+'/forms/'+$target.attr('data-id'));
    $('.share_dialog a').attr('href',window.location.origin+'/forms/'+$target.attr('data-id'));
});

$('.copy').click(function(){
    navigator.clipboard.writeText($('.share_dialog a').attr('href'));
    alert('링크 복사 완료\n'+$('.share_dialog a').attr('href'));
});

$('.blur').click(function(){
    $('.blur, .share_dialog').addClass('hidden');
});