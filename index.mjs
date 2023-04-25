import { parseMd } from "./parse-md.mjs";
import { toolHandle } from "./toolHandle.mjs";

const editorTit= document.querySelector('#editor-tit');
const inpEditor = document.querySelector('#editor-text');
const preview = document.querySelector('#preview');
const memoList = document.querySelector('.list');
const btnReset = document.querySelector('#btn-reset');
const btnSave = document.querySelector('#btn-save');
const backBtn = document.querySelector('#btn-back');
const editBtn = document.querySelector('#btn-edit');
const tools = document.querySelectorAll('.tool');

const saveMemoList = [];
inpEditor.addEventListener('input', inpEditorHandle);
editorTit.addEventListener('input', editorTitHandle);
btnSave.addEventListener('click', btnSaveHandle);
btnReset.addEventListener('click', () => {
  editorTit.value = '';
  inpEditor.value = '';
  preview.innerHTML = '';
});
tools.forEach(tool => tool.addEventListener('click', toolHandle));

backBtn.addEventListener('click', backBtnHandle);
editBtn.addEventListener('click', () => editBtnHandle(i));

(function() {
  const getMemoList = JSON.parse(localStorage.getItem('memoList'));
  if (getMemoList) {
    getMemoList.forEach(v => {
      saveMemoList.push(v);
      creatMemo(v.tit, v.text);
    })
  }
}())

function editorTitHandle() {
  preview.innerHTML = `<h1 class="memo-tit">${editorTit.value}</h1>
    ${parseMd(inpEditor.value)}`;
}

export function inpEditorHandle() {
  if (editorTit.value) {
    preview.innerHTML = `<h1 class="memo-tit">${editorTit.value}</h1>
      ${parseMd(inpEditor.value)}`
  } else {
    preview.innerHTML = ` ${parseMd(inpEditor.value)}`
  }
}

function btnSaveHandle() {
  creatMemo(editorTit.value, inpEditor.value);
  saveMeno();
  clearEditor();
}
function clearEditor() {
  inpEditor.value = '';
  editorTit.value = '';
  preview.innerHTML = '';
};
function creatMemo(tit, text) {
  const li = document.createElement('li');
  li.className = 'box';
  if(tit) {
    li.innerHTML = `<div class="memo-content">
      <h1 class="memo-tit">${tit}</h1>
      ${parseMd(text)}</div>`
  } else {
    li.innerHTML = `<div>${parseMd(text)}</div>`
  }
  li.innerHTML += `
    <div class="wrap-btn">
      <button type="button" class="edit">
        <img src="img/edit.svg" alt="메모 수정하기">
      </button>
      <button type="button" class="delete">
        <img src="img/close.svg" alt="메모 삭제하기">
      </button>
    </div>`
  memoList.appendChild(li)

  li.addEventListener('click', memoHandle);
}
let i = null;

function memoHandle(event) {
  i = getIndex(event.currentTarget);
  if (event.target.classList.contains('delete')) {
    btnRemoveHandle(event.currentTarget);
  } else if (event.target.classList.contains('edit')) {
    btnEditHandle(event.currentTarget);
  }
}
function saveMeno() {
  const memo = {
    tit: editorTit.value,
    text: inpEditor.value
  }
  saveMemoList.push(memo)
  localStorage.setItem('memoList', JSON.stringify(saveMemoList));
}

function btnRemoveHandle(memo) {
  // const i = getIndex(memo);
  memo.remove();
  saveMemoList.splice(i, 1);
  localStorage.setItem('memoList', JSON.stringify(saveMemoList));
}
function btnEditHandle(memo) {
  if (inpEditor.value && editorTit.value) {
    confirm('작성중인 메모가 있습니다')
  } else {
    // const i = getIndex(memo);
    const memoObj = JSON.parse(localStorage.getItem('memoList'))[i];
    editorTit.value = memoObj['tit'];
    inpEditor.value = memoObj['text'];
    memo.remove();
    inpEditorHandle();
    changeBtn2()
    // saveEditBtn.addEventListener('click', saveEdit)
    // backBtn.addEventListener('click', back)
  }
}

function changeBtn() {
  btnReset.style.display = 'block';
  btnSave.style.display = 'block';
  backBtn.style.display = 'none';
  editBtn.style.display = 'none';
}
function changeBtn2() {
  btnReset.style.display = 'none';
  btnSave.style.display = 'none';
  backBtn.style.display = 'block';
  editBtn.style.display = 'block';
}

function backBtnHandle() {
  creatMemo(saveMemoList[i].tit, saveMemoList[i].text);
  changeBtn();
  clearEditor();
}
function editBtnHandle(i) {
  saveMemoList[i] = {
    tit: editorTit.value,
    text: inpEditor.value
  }
  creatMemo(editorTit.value, inpEditor.value);
  localStorage.setItem('memoList', JSON.stringify(saveMemoList));
  changeBtn();
  clearEditor();
}

// common
function getIndex(selector) {
  const nodes = selector.parentNode.childNodes;
  for(let i = 0; i < nodes.length; i++) {
    if (nodes[i] === selector) {
      return i;
    }
  }
}