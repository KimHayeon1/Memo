import { parseMd } from "./parse-md.mjs";
import { toolHandle } from "./toolHandle.mjs";

const createMemoObj = {
  sort: 'newest',
  createMemo(tit, text) {
    const li = document.createElement('li');
    li.className = 'box';
    if(text) {
      li.innerHTML = `<div class="memo-content">
        <h1 class="memo-tit">${tit}</h1>
        <div class="memo-txt">${parseMd(text)}</div>`
    } else {
      li.innerHTML =`<div class="memo-content">
          <h1 class="memo-tit">${tit}</h1>
        </div>`
    }
    li.innerHTML += `
      <div class="wrap-btn">
        <button type="button" class="open">
          <img src="img/open.svg" alt="메모 펼치기">
        </button>
        <button type="button" class="close">
          <img src="img/close.svg" alt="메모 접기">
        </button>
        <button type="button" class="edit">
          <img src="img/edit.svg" alt="메모 수정하기">
        </button>
        <button type="button" class="delete">
          <img src="img/delete.svg" alt="메모 삭제하기">
        </button>
      </div>`
    if(this.sort === 'newest') {
      memoList.prepend(li);
    } else {
      memoList.appendChild(li);
    }
  
    const openBtn = li.querySelector('.open');
    const closeBtn = li.querySelector('.close');
    const editBtn = li.querySelector('.edit');
    const deleteBtn = li.querySelector('.delete');
  
    openBtn.addEventListener('click', openBtnHandle);
    closeBtn.addEventListener('click', closeBtnHandle);
    editBtn.addEventListener('click', btnEditHandle);
    deleteBtn.addEventListener('click', deleteBtnHandle);
  }
}

const editorTit= document.querySelector('#editor-tit');
const inpEditor = document.querySelector('#editor-text');
const preview = document.querySelector('#preview');
const memoList = document.querySelector('.list');
const btnReset = document.querySelector('#btn-reset');
const btnSave = document.querySelector('#btn-save');
const backBtn = document.querySelector('#btn-back');
const editBtn = document.querySelector('#btn-edit');
const tools = document.querySelectorAll('.tool');
const sort = document.querySelector('#sort-memo');

const saveMemoList = [];
sort.addEventListener('change', sortHandle);
inpEditor.addEventListener('input', inpEditorHandle);
editorTit.addEventListener('input', editorTitHandle);
btnSave.addEventListener('click', btnSaveHandle);
btnReset.addEventListener('click', clearEditor);
tools.forEach(tool => tool.addEventListener('click', toolHandle));
backBtn.addEventListener('click', backBtnHandle);
editBtn.addEventListener('click', editBtnHandle);

(function() {
  const getMemoList = JSON.parse(localStorage.getItem('memoList'));
  if (getMemoList) {
    getMemoList.forEach(v => {
      saveMemoList.push(v);
      createMemoObj.createMemo(v.tit, v.text);
    })
  }
}())

function sortHandle(event) {
  clearMemoList()
  if (event.currentTarget.value === '최신순') {
    createMemoObj.sort = 'newest';
  } else {
    createMemoObj.sort = 'oldest';
  }
  saveMemoList.forEach(v => createMemoObj.createMemo(v.tit, v.text))
}
function clearMemoList() {
  memoList.innerHTML = '';
}
function beforeUnloadListener (event){
  event.preventDefault();
  return event.returnValue = "";
}

function editorTitHandle() {
  preview.innerHTML = `<h1 class="memo-tit">${editorTit.value}</h1>
    ${parseMd(inpEditor.value)}`;
    
  beforeUnload(editorTit.value);
}

function beforeUnload(target) {
  if (!target.value) {
    addEventListener("beforeunload", beforeUnloadListener);
  } else {
    removeEventListener("beforeunload", beforeUnloadListener);
  }
}
export function inpEditorHandle() {
  if (editorTit.value) {
    preview.innerHTML = `<h1 class="memo-tit">${editorTit.value}</h1>
      ${parseMd(inpEditor.value)}`
  } else {
    preview.innerHTML = `${parseMd(inpEditor.value)}`
  }
  beforeUnload(inpEditor.value)
}

function btnSaveHandle() {
  if (!editorTit.value) {
    return alert('제목을 입력해주세요')
  }
  createMemoObj.createMemo(editorTit.value, inpEditor.value);
  saveMeno();
  clearEditor();
}
function clearEditor() {
  inpEditor.value = '';
  editorTit.value = '';
  preview.innerHTML = '';
}

let i = null;

function closeBtnHandle(event) {
  const closeBtn = event.currentTarget;
  closeBtn.parentNode.previousElementSibling.children[1].style.display = "none";
  closeBtn.style.display = "none";
  closeBtn.previousElementSibling.style.display = "block";
}
function openBtnHandle(event) {
  const openBtn = event.currentTarget;
  openBtn.parentNode.previousElementSibling.children[1].style.display = "block";
  openBtn.style.display = "none";
  openBtn.nextElementSibling.style.display = "block";
}
function saveMeno() {
  const memo = {
    tit: editorTit.value,
    text: inpEditor.value
  }
  saveMemoList.push(memo)
  localStorage.setItem('memoList', JSON.stringify(saveMemoList));
}

function deleteBtnHandle(event) {
  if (confirm('정말 삭제하시겠습니까?')) {
    const memo = event.currentTarget.parentNode.parentNode;
    i = getIndex(memo);
    memo.remove();
    saveMemoList.splice(i, 1);
    localStorage.setItem('memoList', JSON.stringify(saveMemoList));
  }
}

function btnEditHandle(event) {
  const memo = event.currentTarget.parentNode.parentNode;
  if (inpEditor.value && editorTit.value) {
    confirm('작성중인 메모가 있습니다')
  } else {
    i = getIndex(memo);
    const memoObj = JSON.parse(localStorage.getItem('memoList'))[i];
    editorTit.value = memoObj['tit'];
    inpEditor.value = memoObj['text'];
    memo.remove();
    inpEditorHandle();
    changeBtn2()
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
  if (confirm('변경사항이 저장되지 않습니다. 계속 진행하시겠습니까?')) {
    createMemoObj.createMemo(saveMemoList[i].tit, saveMemoList[i].text);
    changeBtn();
    clearEditor();
  }
}
function editBtnHandle(i) {
  saveMemoList[i] = {
    tit: editorTit.value,
    text: inpEditor.value
  }
  createMemoObj.createMemo(editorTit.value, inpEditor.value);
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