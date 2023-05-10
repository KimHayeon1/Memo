# 메모장

## 기능
### Edit
- 저장 버튼 클릭 : 제목이 비어 있을 경우, '제목을 입력해주세요'
#### 1. 미리보기
- 내용을 입력하면, 미리보기가 나타난다.
#### 2. 툴
- 툴을 클릭하면, 커서 위치에 마크다운 문자가 삽입된다.
- 재클릭하면, 마크다운 문자가 제거된다.
#### 3. 저장 버튼
- 메모 입력 부분, 미리 보기에서 내용이 지워진다.
- 메모 리스트에 추가된다.
- 메모 내용이 저장되며, 새로고침 후에도 남아있다.
#### 4. 지우기 버튼
- 클릭하면 에디터와 미리 보기에서 내용이 리셋된다.
#### 5. 수정하기
- 이전으로 클릭 시, '변경사항이 저장되지 않습니다. 계속 진행하겠습니까?'
- 새로고침 클릭 시, '변경사항이 저장되지 않습니다.'

### 메모
#### 1. 정렬
- 기본값: 최신순
- 변경 시, 사용자에게 보이는 콘텐츠의 정렬이 바뀐다.
- 메모를 추가할 때 정렬에 맞게 추가된다.
#### 2. 삭제 버튼
- 클릭 시, 콘텐츠 제거
- 로컬 스토리지에서도 해당 값이 제거되야 한다.
- '정말 삭제하시겠습니까?'
#### 3. 수정 버튼
- 메모 리스트 섹션에서 제거
- 에디터와 미리 보기에 메모 텍스트 삽입
- 에이터의 '저장' 및 '지우기' 버튼을 숨기고, '수정'와 '이전으로' 버튼 추가
- 로컬 스토리지에서는 제거되지 않으며, '수정' 클릭 시 변경, '이전으로' 클릭 시 변경 없이 메모 리스트 섹션에 되돌리기
#### 3. 접는 버튼
- 제목과 상단 버튼만 보이고, 내용은 숨긴다.
#### 4. (예정)사이즈 조절 & 클릭 드래그로 이동

###체크사항
- 앞뒤 공백 잘 잘리는가
