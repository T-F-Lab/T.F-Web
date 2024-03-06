$('.submit_form').click(function(){
    if(confirm("업로드하면 수정할 수 없습니다.")){
        var ob = new Object();
        var no = false;
        $('.items').find('.form_').each(function(){
            var id = $(this).find('.option input, .option textarea').attr('name');
            var most_ = $(this).children('.most_box')
            var most = false;
            if (most_.length > 0) most = true;
            var checks = [];
            $('input[name='+id+']:checked').each(function(){
                checks.push($(this).val());
            });
            var v = $(this).find('input[type=text]').val();
            if (v != null) checks.push(v);
            else {
                v = $(this).find('textarea').val()
                if (v != null) checks.push(v);
            }

            if (most && !(checks.length > 1)) {

                if (checks.length > 0){
                    if (checks[0].replaceAll(' ','') == '' || checks[0] == null) no = true;
                } else no = true;
            }

            ob[id] = checks;

        });
        if (no){
            alert('필수 답변을 모두 답변해 주세요.');
        } else {
            $.ajax({
                type: 'POST',
                url: window.location.href,
                data: JSON.stringify(ob),
                contentType: 'application/json',
            }) .done((data) => {
                alert('업로드 완료');
            }) .fail((e) => {
                alert('업로드 실패\n'+e);
            }) .always(()=>{
            });
            }
    } else { }
});