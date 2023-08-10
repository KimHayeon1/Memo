import { editorTextHandle } from "./index.mjs";

const editorText = document.querySelector('#editor-text');
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

export function toolHandle(event) {
  editorText.focus();
  changeEditorText(event.currentTarget.getAttribute('id'))
  editorTextHandle();
}

function changeEditorText(key) {
  if (editorText.selectionStart === editorText.selectionEnd) {
    cursor(...mdlist.get(key))
  } else {
    drag(...mdlist.get(key))
  }
}
// 부가설명+마크다운 삽입 => 마크다운 총 1개
function cursor(md1, txt, md2) {
  const start = editorText.selectionStart;
  const end = editorText.selectionEnd;
  const inp = editorText.value;
  const setStart = start + md1.length;

  editorText.value = inp.slice(0, start) + md1 + txt + md2 + inp.slice(end);
  editorText.setSelectionRange(setStart, setStart + txt.length);
}

function drag(md1, _, md2) {
  const start = editorText.selectionStart;
  const end = editorText.selectionEnd;
  const inp = editorText.value;
  const txt1 = inp.slice(0, start);
  const txt2 = inp.slice(end);
  const drag = inp.slice(start, end);

  // 클릭한 md가 드래그 안에 있으면 제거
  if (drag.includes(md1) && drag.includes(md2)) {
    removeMdFromDrag(md1, md2);
    return
  }
  
  // 드래그된 텍스트 양 끝에 md가 있을 때
  for (const [_, v] of mdlist) {
    if (v[0] === txt1.slice(txt1.length - v[0].length) && v[2] === txt2.slice(0, v[2].length)) {
      hasMd(md1, md2, [v[0], v[2]]);
      return;
    }
  }
  
  // 드래그한 txt 얖 옆에 md 붙이기
  addMd(md1, md2);
}

function removeMdFromDrag(md1, md2) {
  const start = editorText.selectionStart;
  const end = editorText.selectionEnd;
  const inp = editorText.value;
  let text = inp.slice(start, end).replace(md1, '');
  text = text.replace(md2, '');

  editorText.value = inp.slice(0, start) + text + inp.slice(end);
  editorText.setSelectionRange(start, end - md1.length - md2.length);
}

function hasMd(md1, md2, has) {
  const start = editorText.selectionStart;
  const end = editorText.selectionEnd;
  const inp = editorText.value;
  const txt1 = inp.slice(0, start);
  const txt2 = inp.slice(end);
  const drag = inp.slice(start, end);
  
  // 드래그 양 끝에 md 재클릭 시 제거
  if (has[0] === md1 && has[1] === md2) {
    editorText.value = txt1.slice(0, txt1.length-has[0].length) + drag + txt2.slice(has[1].length);
    editorText.setSelectionRange(start-md1.length, end+ md1.length +md2.length);
    return;
  }

  //재클릭이 아니라면 md 추가
  editorText.value = txt1 + md1 + drag + md2 + txt2;
  editorText.setSelectionRange(start, end+ md1.length +md2.length);
}

function addMd(md1, md2) {
  const start = editorText.selectionStart;
  const end = editorText.selectionEnd;
  const inp = editorText.value;

  editorText.value = inp.slice(0, start) + md1 + inp.slice(start, end) + md2 + inp.slice(end);
  editorText.setSelectionRange(start+md1.length, end+md1.length);
}