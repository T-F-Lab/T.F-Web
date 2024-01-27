var $drop = $('.file_drag_drop');
var uploads = [];

$drop.on("dragenter", function(e){
    $(this).addClass("dragin");
}).on("dragleave", function(e){
    $(this).removeClass('dragin');
}).on("dragover", function(e){
    e.stopPropagation();
    e.preventDefault();
}).on("drop", function(e){
    $(this).removeClass('dragin');
    e.preventDefault();

    var files = e.originalEvent.dataTransfer.files;
    for (var i = 0; i < files.length; i++){
        var file = files[i];
        var index = uploads.push(file) - 1;
        listFile(file,index);
    }

});

function listFile(f, i){
    var reader = new FileReader();
    reader.onload = (function(f,i){
        return function(e){
            var div = '<div class="listFile">';
            div += '<img data-idx="'+i+'" class="listFile_x" src="/file/img/close_x.svg">';
            div += '<p> ' +  unescape(f.name) + '</p></div>';
            $('.file_list').append(div);
        };
    })(f,i);
    reader.readAsDataURL(f);
}

$('.file_list').on("click", '.listFile_x', function(e){
    var $target = $(e.target);
    var i = $target.attr('data-idx');
    uploads[i].upload = 'false';
    if ($('.file_list').children().length-1 <= 0) {
        uploads = [];
    }
    $target.parent().remove();
});

$('.submit').click(function(){
    var form = new FormData();
    $.each(uploads,function(i,file) {
        if (file.upload != 'false') {
            form.append('upload',file,file.name);
        }
    });

    $.ajax({
        'url': '/upload/file',
        data: form,
        type: 'post',
        contentType: false,
        processData: false,
        success: function(m){
            alert("Upload End");
        }
    });

    uploads = [];

    $('.file_list').children().remove();
});