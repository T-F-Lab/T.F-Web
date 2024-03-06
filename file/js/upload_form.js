$('.add').click(function(){
    var div = '<div class="item">';
    div += '<input class="input_q" placeholder="여기에 질문을 입력하세요">';
    div += '<select class="type" onchange="change_type(this);">';
    div += '<option value="checkbox">체크박스</option>';
    div += '<option value="radio">객관식 질문</option>';
    div += '<option value="select" disabled>드롭다운</option>';
    div += '<option value="text">단답형</option>';
    div += '<option value="long">장문형</option>';
    div += '<option value="date" disabled>날짜</option>';
    div += '<option value="time" disabled>시간</option>';
    div += '</select>';
    div += '<div class="copy"><img src="/file/img/copy.svg"></div>'
    div += '<div class="delete"><img src="/file/img/delete.svg"></div>';
    div += '<textarea class="intput_dec" placeholder="설명"></textarea>';
    div += '<hr><div class="q_ui">';
    div += '<div class="q_list">'
    div += '<div class="q_item"> <input class="q_type" type="checkbox" disabled> <input class="q_text" value="옵션1"><img class="delete_q" onclick="delete_q(this);" src="/file/img/close_x.svg"></div>'
    div += '</div>';
    div += '<div class="add_item"><p>옵션추가</p></div></div>'
    div += '<div class="most"><label>필수</label><input type="checkbox"></div>';
    div += '</div>';
    $('.items').append(div);
});

$('.items').on('click', '.delete', function(e){
    $target = $(e.target);
    $target.parent().parent().remove();
});

$('.items').on('click', '.copy', function(e){
    $target = $(e.target);
    $target.parent().parent().clone().appendTo('.items');
});

$('.items').on('click','.add_item', function(e){
    $target = $(e.target);
    var type = $target.parent().parent().parent().children('.type').val();

    if (type != 'select' && type != 'long'){
        var div = '<div class="q_item"> <input class="q_type" type="'+type+'" disabled><input class="q_text" value="옵션'+($target.parent().parent().children('.q_list').children().length+1)+'"><img class="delete_q" onclick="delete_q(this);" src="/file/img/close_x.svg"></div>';
        $target.parent().parent().children('.q_list').append(div);
    }

});

function delete_q(e){
    if (e.parentNode.parentNode.children.length>1)
        e.parentNode.remove();
}

function change_type(e){
    if (['text', 'long'].includes(e.value)) {

        e.parentNode.querySelector('.add_item').style.visibility = "hidden";

        var s = e.parentNode.querySelector('.q_list').querySelectorAll('.q_item');
        for (var i =0; i<s.length; i++) {
            s[i].remove();
        }

        if (e.value == 'text'){
            const div = document.createElement('div');
            var div_ = '단답형 텍스트';
            div.className = "q_item dumy";
            div.innerHTML = div_;
            e.parentNode.querySelector('.q_list').append(div);
        }
        else {
            const div = document.createElement('div');
            var div_ = '장문형 텍스트';
            div.className = "q_item dumy";
            div.innerHTML = div_;
            e.parentNode.querySelector('.q_list').append(div);
        }
    } else {
        e.parentNode.querySelector('.add_item').style.visibility = "visible";
        $(".dumy").remove();

        if (e.parentNode.querySelector('.q_list').querySelectorAll('.q_item').length <= 0){

            var div_ = '<input class="q_type" disabled><input class="q_text" value="옵션'+($target.parent().parent().children('.q_list').children().length+1)+'"><img class="delete_q" onclick="delete_q(this);" src="/file/img/close_x.svg">';
            const div = document.createElement('div');
            div.className = 'q_item';
            div.innerHTML = div_;
            e.parentNode.querySelector('.q_list').append(div);
        }
        var s = e.parentNode.querySelector('.q_list').querySelectorAll('.q_type');
        for (var i =0; i<s.length; i++) {
            s[i].type = e.value;
        }
    }
}


$('.submit').click(function(){

    if(confirm("업로드하면 수정할 수 없습니다.")){
        var result = [];
        $('.items').find('.item').each(function(){
            var ob = new Object();
            ob.title = $(this).find('.input_q').val();
            ob.dec = $(this).find('.intput_dec').val();
            ob.type = $(this).find('.type').val();
            ob.most = $(this).find('.most').children('input').is(':checked');
            var options = [];
            var l = $(this).children('.q_ui').children('.q_list').children('.q_item');
            for (var i=0; i<l.length; i++){
                options.push(l.eq(i).find('.q_text').val());
            }
            ob.options = options;

            result.push(ob);
        });

        var ob = new Object();
        ob.title = $('.form_title').val();
        ob.dec = $('.form_dec').val();
        ob.time = $('.form_time').val();
        ob.items = result;

        $.ajax({
            type: 'POST',
            url: '/upload/forms',
            data: JSON.stringify(ob),
            contentType: 'application/json',
        }) .done((data) => {
            alert('업로드 완료');
        }) .fail((e) => {
            alert('업로드 실패\n'+e);
        }) .always(()=>{
        });
    }else{
    }
});