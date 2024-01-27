
var $edit = -1;

function category_item_hover_display(target,value){
    var tag = target.prop("tagName").toLowerCase();
    var t;
    if (tag=='p'){
        t = target.parent().parent();
    } else if (target.hasClass('category_')) {
        t = target;
    } else{
        t = target.parent();
    }
    if (value=='flex'){
        t.children('.category_item').children().css('display', 'block');
        t.children('.category_item').children('.edit').css('display', 'none');
        t.children('.category_item_hover').children('.dec').css('display','block');
        t.children('.category_item_hover').children('.edit').css('display','none');

        var dec = t.children('.category_item_hover').children('.edit').children('.dec_').attr('placeholder');
        t.children('.category_item_hover').children('.edit').children('.dec_').val(dec);

        var title = t.children('.category_item').children('.edit').children('.title').attr('placeholder');
        t.children('.category_item').children('.edit').children('.title').val(title);

        var color = t.children('.category_item').children('.edit').children('.color').attr('placeholder');
        t.children('.category_item').children('.edit').children('.color').val(color);

        var style = 'background-color: rgb('+color;
        style = style + ');background: linear-gradient(160deg, rgba(100,100,100,0.8) 0%, rgb('+color+') 100%);';
        t.children('.category_item').attr('style',style);
    }
    else {
        t.children('.category_item').children().css('display', 'none');
        t.children('.category_item').children('.edit').css('display', 'flex');
        t.children('.category_item_hover').children('.dec').css('display','none');
        t.children('.category_item_hover').children('.edit').css('display','block');
    }
}

$('.category_list').on('click', '.category_', function(e){
    var $target = $(e.target);
    if ($target.hasClass('input')) return;
    if ($edit == -1){
        $edit = $(e.target);

        category_item_hover_display($target, 'none');
    } else {
        category_item_hover_display($edit, 'flex');
        $edit = -1;
    }

})

$(document).on('click', function(e){
    var $target = $(e.target);
    if (!$target.hasClass('ct') && $edit != -1 && !$target.hasClass('input')){
        console.log($edit);
        category_item_hover_display($edit, 'flex');
        $edit=-1;
    }
});

function upload(data){
    $.ajax({
        type: 'POST',
        url: '/upload/categories',
        data: JSON.stringify(data),
        contentType: 'application/json',
    }) .done((data) => {
        alert('업로드 완료');
    }) .fail((e) => {
        alert('업로드 오류\n'+e);
    }) .always(()=>{
        console.log('always');
    });
}

$('.category_').on('click', '.submit', function(e) {
    var $target = $(e.target);
    console.log('=== SUBMIT ===');
    var clist = $target.parent().parent().parent().parent();
    var title = clist.children('.category_item').children('.edit').children('.title').val();
    var color = clist.children('.category_item').children('.edit').children('.color').val();
    color = color_check(color);
    var dec = clist.children('.category_item_hover').children('.edit').children('.dec_').val();
    var id = $target.attr('data-id');
    console.log('title: '+ title+ ' | color: '+ color + ' | ' +dec + ' | id: '+id);

    const data = {
        edit: 1,
        title: title,
        color: color.split(', '),
        dec: dec,
    }
    upload(data);

});

$('.color').change(function(e){
    var $target = $(e.target);
    console.log($target.val());

    var val = color_check($target.val());

    $target.val(val);

    var style = 'background-color: rgb('+val;
    style += ');background: linear-gradient(160deg, rgba(100,100,100,0.8) 0%, rgb('+val+') 100%);';
    $target.parent().parent().attr('style',style);


});

function color_check(val_){
    var val = val_
    var remove_list = [];
    var comma = 0;
    for (var i=0; i<val.length; i++){
        if (val[i] == ',') comma++;
        if (!Number.isInteger(val[i]-1)){
            if (!(val[i] == ',' || val[i] == ' ')){
                remove_list.push(val[i]);
                console.log('REmove : '+val[i]);
            }
        }
    }
    for (var i=0; i<remove_list.length; i++){
        val = val.replace(remove_list[i], '');
    }
    val = val.replaceAll(' ','').replaceAll(',',', ');
    if (comma < 3){
        if (comma == 0 && val.length <= 0) val = '0';
        for (var i=0; i<2-comma; i++){
            var front_int = false;
            for (var l=val.length-1; val[l] != ' '; l--){
                front_int = true;
                break;
            }
            if (!front_int) val += '0';
            val += ', 0';
        }
    }

    var front_int = false;
    for (var l=val.length-1; val[l] != ' '; l--){
        front_int = true;
        break;
    }
    if (!front_int) val += '0';

    var val2 = val.split(', ');

    console.log("val2: "+val2.length);

    for (var i=0; i<val2.length; i++){
        if (val2[i].replaceAll(' ','')=='') val2[i]='0';
        var l = Number(val2[i]);
        if (l<0) val2[i] = 0;
        else if (l>255) val2[i] = 255;
    }

    val = val2.join(', ');

    return val;
}