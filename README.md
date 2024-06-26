# T.F-Web

* * *

### 개요

서울로봇고등학교의 미인정 동아리 T.F Lab의 홈페이지의 개발버전이다.

* T.F Web: http://www.seon06.co.kr | No Open
* T.F Web 임시 서버: https://tf-lab.run.goorm.site
* Test Server: http://www.seon06.co.kr:5000 | Random

* * *

### 사용된 외부 프로젝트
CK Editor 5 ( Document )

경기천년체

jQuery 3.6.0

Gooogle Fonts의 svg
***

### 개발환경

python 3.12.0, flask 3.0.0, Jinja2 3.1.2

사용 라이브러리
* flask
* sqlite3
* time
* werkzeug.utils
* uuid
* json
* html


* * *

### 초기 설정

/file 폴더 안 "uploads" 폴더 생성 (/file/uploads)

/ckeditor/5/40/2/0 폴더 안에 CKEditor 5 40.2.0 버전 빌드파일을 첨부

main.py을 처음 실행시 data.db파일이 자동 생성됨 (SQLite3 | 데이터 베이스 파일)

실행전 key.txt 파일 작성 필요. 맨 윗줄에 텍스트를 입력하면 해당 텍스트로 암호화 됨.
다만 key.txt를 수정시 등록된 비밀번호는 모두 사용이 불가함. ( 되돌리면 가능 )

* * * 

### 변경 내역
* 관리 페이지 모바일 지원
* 오타 수정
* 업로드한 파일/이미지 삭제
* 멤버 리스트
* 버그 수정
* 소개(환영) 페이지 추가
* Form 기능 추가
* 해쉬 암호화 적용
* * *

### 저작권

Apache-2.0 license

(excluding logo, only code)
=======

기여자 BuildTools == seon0313

* * * 
### 업데이트 내역
(y/m/d)
* 2023/12/09 - Start Develop
* 2024/01/16 - Complete Develop
* 2024/01/26 - Mobile Support
* 2024/01/27 - GitHub Upload
* 2024/01/30 - Responsive design applied, Cleaning
* 2024/02/05 - Management page - mobile support update
* 2024/02/27 - Introduction (Wellcome) page (BETA), uploaded file management Update
* 2024/02/28 - Apply hash encryption, form system add
