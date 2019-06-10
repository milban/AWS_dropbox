# Complete
## Front
* 파일 리스트 띄우기
  * 서버 DB에서 파일리스트 받아서 띄우기
  * 유저가 dir 클릭 Event 발생시, 해당 dir 안의 파일리스트 띄우기 (구현했지만, 실험 아직 안함)
* 파일 업로드
  * db에 등록
  * 새로 등록한 파일까지 파일 리스트 띄우기
* 파일 삭제
  * 파일 삭제 Event 만들기
  * Event 발생 시 서버에 파일 삭제 요청하기
  * Response 받기
  * Response 받은 후, 프론트 파일리스트에서도 지우기
* 파일 다운로드, 공유
  * 서버에 해당 경로 preSignedURL 요청
  * Response 받기
  * url 사용해서 다운로드 구현
* 로그인
* 회원가입
* 유저가 업로드시, 파일 경로 REST로 보내기
* S3
  * upload file, download file, delete file, create dir, delete dir
* 유저 쿠키
 * 유저 쿠키 설정 및 유저 쿠키 ID 
* 파일 삭제
  * 다중 파일 삭제 (백엔드와 협업 필요)
* 디렉토리
  * 만들기
  * 삭제하기
  * 이동
## Backend
* 파일리스트 보내주기
* 파일 업로드 DB까지 저장
* 파일, 디렉토리 삭제

# To do
## Front
* S3
 * multipart upload
 * html헤더에 인증토큰 넣기

## Backend
* 중복 파일 upload시 에러 발생 처리
* 버켓 만들어주기
