function th_set(url){
    $('.p_img').attr('src', url);
}

$('.refresh_c').click(function(){
    $.getJSON('/upload/get/categories', function(data){
        $('.categories').children().remove();

        if (data.length <= 0 ){
            var p = 'p class="no_file">불러온 카테고리가 없습니다.<br>업로드 후 오른쪽 상단<img style="border-radius:1vw;background-color:rgb(255,255,255);" src="/file/img/refresh.svg"> 버튼을 눌러 새로고침 해주세요.</p>';
            $('.categories').append(p);
        } else {
            for (var i=0; i<data.length; i++){
                var div = '<div class="category_item">';
                div += '<p data-idx="' +data[i][0]+ '" data-text="'+data[i][1]+'">' + data[i][1] + '</p></div>';
                $('.categories').append(div);
            }
        }
    });
});

$('.categories').on('click','.category_item', function(e){
    var $target = $(e.target);
    var p = '<p>'+$target.attr('data-text')+'</p>';
    $('.category_').children().remove();
    $('.category_').attr('data-category',$target.attr('data-idx'));
    $('.category_').append(p);
});

$('.refresh').click(function(){
    $.getJSON('/upload/get/files', function(data) {
        $('.insert_files').children().remove();
        if (data.length <= 0) {
            var p = '<p class="no_file">업로드한 사진이나 파일이 없습니다.<br>업로드 후 오른쪽 상단<img style="border-radius:1vw;background-color:rgb(255,255,255);" src="/file/img/refresh.svg"> 버튼을 눌러 새로고침 해주세요.</p>';
            $('.insert_files').append(p);
        } else {

            for (var i=0; i<data.length; i++){
                var div = '<div class="insert_item" data-idx="'+data[i][3]+'">';
                div += '<img class="ii_img" src="';
                if (data[i][1] == 'video') div=div+'/file/img/video_file.svg"';
                else if (data[i][1] == 'image') div=div+data[i][3]+'"';
                else if (data[i][1] == 'audio') div=div+'/file/img/audio_file.svg"';

                div += ' onerror="this.src='+ "'/file/img/draft.svg'" +'">';
                div += '<a href='+data[i][3]+' target="_blank">'+data[i][2]+'</a></div>';

                div += '<div class="thumbnail" onclick="th_set(\''+data[i][3]+'\')">썸네일로</div>'

                $('.insert_files').append(div);
            }
        }
    });
});