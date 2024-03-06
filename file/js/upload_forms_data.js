var minus = document.getElementsByClassName('minus')[0];
var plus = document.getElementsByClassName('plus')[0];
var index = 1;
var index_ = document.getElementsByClassName('form_index_p')[0];
var list = document.getElementsByClassName('f').length;
index_.innerText='1/'+list;

minus.addEventListener('click', function (event) {
    if (index > 1) index--;
    index_.innerText=index+'/'+list;
    dj();
});

plus.addEventListener('click', function (event) {
    if (list>index)index++;
    index_.innerText=index+'/'+list;
    dj();
});

function dj(){
    var l = document.getElementsByClassName('f');
    for (var i=0; i<l.length; i++){
        l[i].classList.add('hidden');
    }
    document.getElementById(''+(index-1)).classList.remove('hidden');
}