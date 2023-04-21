import { parseMd } from "./parseMd.mjs";

const inpEditor = document.querySelector('#editor-text');
const preview = document.querySelector('#preview');
const memoList = document.querySelector('.list');
const btnSave = document.querySelector('#btn-save');
const editorTit= document.querySelector('#editor-tit');
const previewTit = document.querySelector('#preview h1');
const previewText = document.querySelector('#preview p');
const btnBold = document.querySelector('#bold');

btnBold.addEventListener('click', () => {
  console.log(inpEditor.selectionStart)
  console.log(inpEditor.selectionEnd)
  inpEditor.value = inpEditor.value.slice(0, inpEditor.selectionStart) + '** **' + inpEditor.value.slice(inpEditor.selectionStart-1)
});

const saveMemoList = [];
inpEditor.addEventListener('input', inpEditorHandle);
editorTit.addEventListener('input', editorTitHandle);
btnSave.addEventListener('click', btnSaveHandle);

(function() {
  const getMemoList = JSON.parse(localStorage.getItem('memoList'));
  if (getMemoList) {
    getMemoList.forEach(v => {
      saveMemoList.push(v)
      creatMemo(v.tit, v.text)
    })
  }
}())

function inpEditorHandle() {
  previewText.textContent = inpEditor.value
}
function btnSaveHandle() {
  creatMemo(previewTit.textContent, inpEditor.value);
  saveMeno();
  inpEditor.value = '';
  editorTit.value = '';
  previewText.textContent = '';
  previewTit.textContent = '';
}
function creatMemo(tit, text) {
  const li = document.createElement('li');
  li.className = 'box';
  li.innerHTML = `
    <h1 class="memo-tit">${tit}</h1>
    ${parseMd(text)}
    <button type="button" class="btn-primary edit">수정</button>
    <button type="button" class="btn-primary delete">삭제</button>`
  memoList.appendChild(li)

  const btnEdit = li.querySelector('.edit');
  const btnDelete = li.querySelector('.delete');
  // 함수 추가
  // btnEdit.addEventListener('click', btnEditHandle)
  btnDelete.addEventListener('click', btnDeleteHandle);
}

function saveMeno() {
  const memo = {
    tit: previewTit.textContent,
    text: previewText.textContent
  }
  saveMemoList.push(memo)
  localStorage.setItem('memoList', JSON.stringify(saveMemoList));
}

function editorTitHandle() {
  previewTit.textContent = editorTit.value;
}

function btnDeleteHandle(event) {
  const i = getIndex(event.currentTarget.parentNode);
  event.currentTarget.parentNode.remove();
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