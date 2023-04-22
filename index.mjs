import { parseMd } from "./parse-md.mjs";

const editorTit= document.querySelector('#editor-tit');
const inpEditor = document.querySelector('#editor-text');
const preview = document.querySelector('#preview');
const memoList = document.querySelector('.list');
const btnReset = document.querySelector('#btn-reset');
const btnSave = document.querySelector('#btn-save');
const btnBold = document.querySelector('#bold');

const saveMemoList = [];
inpEditor.addEventListener('input', inpEditorHandle);
editorTit.addEventListener('input', editorTitHandle);
btnSave.addEventListener('click', btnSaveHandle);
btnReset.addEventListener('click', () => {
  editorTit.value = '';
  inpEditor.value = '';
  preview.innerHTML = '';
})

(function() {
  const getMemoList = JSON.parse(localStorage.getItem('memoList'));
  if (getMemoList) {
    getMemoList.forEach(v => {
      saveMemoList.push(v)
      creatMemo(v.tit, v.text)
    })
  }
}())

btnBold.addEventListener('click', () => {
  console.log(inpEditor.selectionStart)
  console.log(inpEditor.selectionEnd)
  inpEditor.value = inpEditor.value.slice(0, inpEditor.selectionStart) + '** **' + inpEditor.value.slice(inpEditor.selectionStart-1)
});

function editorTitHandle() {
  preview.innerHTML = `<h1 class="memo-tit">${editorTit.value}</h1>
    ${parseMd(inpEditor.value)}`
}

function inpEditorHandle() {
  if (editorTit.value) {
    preview.innerHTML = `<h1 class="memo-tit">${editorTit.value}</h1>
      ${parseMd(inpEditor.value)}`
  } else {
    preview.innerHTML = ` ${parseMd(inpEditor.value)}`
  }
  console.log(preview.innerHTML)
}

function btnSaveHandle() {
  creatMemo(editorTit.value, inpEditor.value);
  saveMeno();
  inpEditor.value = '';
  editorTit.value = '';
  preview.innerHTML = '';
}
function creatMemo(tit, text) {
  const li = document.createElement('li');
  li.className = 'box';
  if(tit) {
    li.innerHTML = `<h1 class="memo-tit">${tit}</h1>`
  }
  li.innerHTML += `
    ${parseMd(text)}
    <div class="wrap-btn">
      <button type="button" class="btn-primary edit">수정</button>
      <button type="button" class="btn-primary delete">삭제</button>
    </div>`
  memoList.appendChild(li)

  const btnEdit = li.querySelector('.edit');
  const btnDelete = li.querySelector('.delete');
  // 함수 추가
  // btnEdit.addEventListener('click', btnEditHandle)
  btnDelete.addEventListener('click', btnDeleteHandle);
}

function saveMeno() {
  const memo = {
    tit: editorTit.value,
    text: inpEditor.value
  }
  saveMemoList.push(memo)
  localStorage.setItem('memoList', JSON.stringify(saveMemoList));
}
function btnDeleteHandle(event) {
  const i = getIndex(event.currentTarget.parentNode);
  event.currentTarget.parentNode.parentNode.remove();
  saveMemoList.splice(i, 1);
  localStorage.setItem('memoList', JSON.stringify(saveMemoList));
}

function getIndex(selector) {
  selector.parentNode.childNodes.forEach((v, i) => {
    if (v === selector) {
      return i;
    }
  })
}