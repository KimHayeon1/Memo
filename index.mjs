import { parseMd } from "./parse-md.mjs";

const editorTit= document.querySelector('#editor-tit');
const inpEditor = document.querySelector('#editor-text');
const preview = document.querySelector('#preview');
const memoList = document.querySelector('.list');
const btnReset = document.querySelector('#btn-reset');
const btnSave = document.querySelector('#btn-save');
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

(function() {
  const getMemoList = JSON.parse(localStorage.getItem('memoList'));
  if (getMemoList) {
    getMemoList.forEach(v => {
      saveMemoList.push(v);
      creatMemo(v.tit, v.text);
    })
  }
}())

const mdlist = new Map([
  ['header', ['#', '제목', '']],
  ['bold', ['**', '텍스트', '**']],
  ['italic', ['_', '텍스트', '_']],
  ['strike', ['~~', '텍스트', '~~']],
  ['link', ['[', '링크텍스트', '](URL)']],
  ['code', ['```\n', '코드를 입력하세요', '\n```']],
  ['quote', ['>', '인용문', '']],
  ['ul', ['*', '텍스트', '']],
  ['ol', ['1.', '텍스트', '']],
])
function toolHandle(event) {
  const key = event.currentTarget.getAttribute('id');
  addMd(...mdlist.get(key));
  inpEditorHandle();
}

function addMd(md1, txt, md2) {
  const cursorStart = md1.length;
  const start = inpEditor.selectionStart;
  const end = inpEditor.selectionEnd;
  const inp = inpEditor.value;
  inpEditor.focus();

  if (start === end) {
    const setStart = start + cursorStart;
    inpEditor.value = inp.slice(0, start) + md1 + txt + md2 + inp.slice(start);
    inpEditor.setSelectionRange(setStart, setStart + txt.length);
    return;
  }

  const startTxt = inp.slice(0, start);
  const endTxt = inp.slice(end);
  const drag = inp.slice(start, end);

  // 드래그 안의 마크다운 중복 시 제거
  if (drag.includes(md1) && drag.includes(md2)) {
    let text = drag.replace(md1, '')
    text = text.replace(md2, '')
    inpEditor.value = startTxt + text + endTxt;
    inpEditor.setSelectionRange(start, end- md1.length -md2.length);
    return;
  }

  const find = [];
  mdlist.forEach(v => {
    if (v[0] === startTxt.slice(startTxt.length - v[0].length) && v[2] === endTxt.slice(0, v[2].length)) {
      find.push(v[0], v[2])
    }
  });

  if (find.length) {
    // 드래그 양 옆에 마크다운 중복 시 제거
    if (find[0] === md1 && find[1] === md2) {
      inpEditor.value = startTxt.slice(0, startTxt.length-find[0].length) + drag + endTxt.slice(find[1].length);
      inpEditor.setSelectionRange(start-md1.length, end+ md1.length +md2.length);
      return;
    } 
    // 드래그 양옆에 마크다운 삽입
    inpEditor.value = startTxt + md1 + drag + md2 + endTxt;
    inpEditor.setSelectionRange(start, end+ md1.length +md2.length);
    return;
  }
  
  // 드래그 + 마크다운 제거
  inpEditor.value = startTxt + md1 + drag + md2 + endTxt;
  inpEditor.setSelectionRange(start+cursorStart, end+cursorStart);
}

function editorTitHandle() {
  preview.innerHTML = `<h1 class="memo-tit">${editorTit.value}</h1>
    ${parseMd(inpEditor.value)}`;
}

function inpEditorHandle() {
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