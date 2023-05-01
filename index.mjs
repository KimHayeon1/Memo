import { parseMd } from "./parse-md.mjs";
import { toolHandle } from "./toolHandle.mjs";

const editorTit= document.querySelector('#editor-tit');
const tools = document.querySelectorAll('.tool');
const editorText = document.querySelector('#editor-text');
const preview = document.querySelector('#preview');
const resetBtn = document.querySelector('#btn-reset');
const saveBtn = document.querySelector('#btn-save');
const backBtn = document.querySelector('#btn-back');
const saveEditBtn = document.querySelector('#btn-edit');
const sortSelect = document.querySelector('#sort-memo');
const memoList = document.querySelector('.list');

const saveMemoList = [];
let sort = 'newest';

sortSelect.addEventListener('change', sortSelectHandle);
editorText.addEventListener('input', editorTextHandle);
editorTit.addEventListener('input', editorTitHandle);
saveBtn.addEventListener('click', saveBtnHandle);
resetBtn.addEventListener('click', clearEditor);
tools.forEach(tool => tool.addEventListener('click', toolHandle));
backBtn.addEventListener('click', backBtnHandle);
saveEditBtn.addEventListener('click', saveEditBtnHandle);

(function() {
  const getMemoList = JSON.parse(localStorage.getItem('memoList'));
  if (getMemoList) {
    getMemoList.forEach(v => {
      saveMemoList.push(v);
      createMemo(v.tit, v.text);
    })
  }
}())
function createMemo(tit, text) {
  const li = document.createElement('li');
  li.className = 'box';
  if(text) {
    li.innerHTML = 
      `<div class="memo-content">
        <h1 class="memo-tit">${tit}</h1>
        <div class="memo-txt">${parseMd(text)}</div>
      </div>`;
  } else {
    li.innerHTML =
      `<div class="memo-content">
        <h1 class="memo-tit">${tit}</h1>
      </div>`;
  }
  li.innerHTML += 
    `<div class="wrap-btn">
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
    </div>`;
  if(sort === 'newest') {
    memoList.prepend(li);
  } else {
    memoList.appendChild(li);
  }

  li.querySelector('.open').addEventListener('click', openBtnHandle);
  li.querySelector('.close').addEventListener('click', closeBtnHandle);
  li.querySelector('.edit').addEventListener('click', editBtnHandle);
  li.querySelector('.delete').addEventListener('click', deleteBtnHandle);
}

function sortSelectHandle(event) {
  clearMemoList();
  if (event.currentTarget.value === '최신순') {
    sort = 'newest';
  } else {
    sort = 'oldest';
  }
  saveMemoList.forEach(v => createMemo(v.tit, v.text));
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
    ${parseMd(editorText.value)}`;
    
  beforeUnload(editorTit.value);
}

function beforeUnload(target) {
  if (!target.value) {
    addEventListener("beforeunload", beforeUnloadListener);
  } else {
    removeEventListener("beforeunload", beforeUnloadListener);
  }
}
export function editorTextHandle() {
  renderPreview()
  beforeUnload(editorText.value);
}
  
function renderPreview() {
  if (editorTit.value) {
    preview.innerHTML = 
      `<h1 class="memo-tit">${editorTit.value}</h1>
      ${parseMd(editorText.value)}`;
  } else {
    preview.innerHTML = `${parseMd(editorText.value)}`;
  }
}

function saveBtnHandle() {
  if (!editorTit.value) {
    return alert('제목을 입력해주세요');
  }
  createMemo(editorTit.value, editorText.value);
  saveMemo();
  clearEditor();
}

function clearEditor() {
  editorText.value = '';
  editorTit.value = '';
  preview.innerHTML = '';
  removeEventListener("beforeunload", beforeUnloadListener);
}

let i;

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

function saveMemo() {
  const memo = {
    tit: editorTit.value,
    text: editorText.value
  };
  saveMemoList.push(memo);
  localStorage.setItem('memoList', JSON.stringify(saveMemoList));
}

function deleteBtnHandle(event) {
  if (confirm('정말 삭제하시겠습니까?')) {
    const memo = event.currentTarget.parentNode.parentNode;
    if(sort === 'newest') {
      i = saveMemoList.length - 1 - getIndex(memo);
    } else {
      i = getIndex(memo);
    }
    memo.remove();
    saveMemoList.splice(i, 1);
    localStorage.setItem('memoList', JSON.stringify(saveMemoList));
  }
}

function editBtnHandle(event) {
  const memo = event.currentTarget.parentNode.parentNode;
  if (editorText.value && editorTit.value) {
    confirm('작성중인 메모가 있습니다');
  } else {
    if(sort === 'newest') {
      i = saveMemoList.length - 1 - getIndex(memo);
    } else {
      i = getIndex(memo);
    }
    const memoObj = JSON.parse(localStorage.getItem('memoList'))[i];
    editorTit.value = memoObj['tit'];
    editorText.value = memoObj['text'];
    memo.remove();
    editorTextHandle();
    changeBtn();
  }
}

function changeBtn() {
  resetBtn.classList.toggle('hidden');
  saveBtn.classList.toggle('hidden');
  backBtn.classList.toggle('hidden');
  saveEditBtn.classList.toggle('hidden');
}

function backBtnHandle() {
  if (confirm('변경사항이 저장되지 않습니다. 계속 진행하시겠습니까?')) {
    createMemo(saveMemoList[i].tit, saveMemoList[i].text);
    changeBtn();
    clearEditor();
  }
}

function saveEditBtnHandle() {
  console.log(i)
  saveMemoList[i] = {
    tit: editorTit.value,
    text: editorText.value
  };
  createMemo(editorTit.value, editorText.value);
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