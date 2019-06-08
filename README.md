# Complete
## Front
* 파일 리스트 띄우기
  * 아직 서버 DB에서 파일리스트 받아서 띄우는건 안함
* 로그인
* 회원가입
* 유저가 업로드시, 파일 경로 REST로 보내기
## Backend
* ...
# To do
## Front
* 파일 리스트 띄우기
  * 서버 DB에서 파일리스트 받아서 띄우기
  * 유저가 dir 클릭 Event 발생시, 해당 dir 안의 파일리스트 띄우기
* S3 Upload
* 파일 다운로드, 공유
  * 서버에 해당 경로 preSignedURL 요청
  * Response 받기
  * url 사용해서 다운로드 구현
* 파일 삭제
  * 파일 삭제 Event 만들기
  * Event 발생 시 서버에 파일 삭제 요청하기
  * Response 받기
  * Response 받은 후, 프론트 파일리스트에서도 지우기
## Backend
* ...
