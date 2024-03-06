let $editor;


function editorSet(ed){
    $editor = ed;
}

function setData(msg){
    $editor.setData($('<div />').html(msg).text());
}

$('.image_inserter_in').on("click",".insert_item", function(e){
    var $target = $(e.target);
    var i = $target.attr('data-idx');
    $editor.setData($editor.getData()+'<img src="'+i+'">');
});

function upload(data){
    $.ajax({
        type: 'POST',
        url: '/upload/project',
        data: JSON.stringify(data),
        contentType: 'application/json',
    }) .done((data) => {
        alert('업로드 완료');
    }) .fail((e) => {
        alert('업로드 실패\n'+e);
    }) .always(()=>{
    });
}

$('.project_upload').click(function(){
    var title = $('.title_input').val();
    var html = $editor.getData();
    var src = $('.p_img').attr('src');
    var category = $('.category_').attr('data-category');

    if (title == '') alert('제목을 입력해주세요.');
    else {
        if (src=='') alert('삽입 탭에서 썸네일을 지정해 주세요.');
        else {
            if (html=='') alert('글을 작성해주세요.');
            else {
                console.log('UPLOAD');

                if (category=='' || category == 0) category = 0;

                if ($('.project_upload').attr('data-edit') == "true"){
                    let searchParams = new URLSearchParams(window.location.search)
                    let id = searchParams.get('edit')
                    const data = {
                        title: title,
                        html: html,
                        src: src,
                        category: category,
                        edit: 1,
                        id: id,
                    };
                    upload(data);
                } else {
                    const data = {
                        title: title,
                        html: html,
                        src: src,
                        category: category,
                        edit: 0,
                    };
                    upload(data);
                }
            }
        }
    }
});

DecoupledEditor
    .create( document.querySelector( '#editor' ), {
        placeholder: '여기에 본문을 작성하세요.',
        /*toolbar: [ 'Heading', 'ImageInsert' ]*/
    } )
    .then( editor => {
        const toolbarContainer = document.querySelector( '#toolbar-container' );
        toolbarContainer.appendChild( editor.ui.view.toolbar.element );
        editorSet(editor);
    } )
    .catch( error => {
        console.error( error );
    } );