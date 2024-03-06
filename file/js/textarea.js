const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", onInput, false);
}

function onInput() {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + "px";
}