var albumBucketName = 'beanuploadtestbucket';
var bucketRegion = 'ap-northeast-2';
var IdentityPoolId = 'ap-northeast-2:ca1edf4b-0706-4e3e-906c-9f0b2f823ca5';

//var content = document.querySelector('.content')
//var testBtn = document.querySelector('.testBtn')
var currentPath  = null// 파일이름 뺀 현재 경로
var currentFilePath // 파일이름 포함한 현재 경로
var uploadFileName // 업로드할 파일 이름

var currentDir //경로표시해주는 화면상의 텍스트
var pastPathListDropdown = document.getElementById('locDropdown')
var pastPathList = []

var locationbtn = document.querySelector('#locDropdown')


function getCookie(cName) {
    console.log(cName)
  cName = cName + '=';
  var cookieData = document.cookie;
  var start = cookieData.indexOf(cName);
  var cValue = '';
  console.log(start)
  if(start != -1){
      start += cName.length;
      var end = cookieData.indexOf(';', start);
      if(end == -1)end = cookieData.length;
      cValue = cookieData.substring(start, end);
  }
  return unescape(cValue);
}

function deleteCookie( cookieName )
 {
  var expireDate = new Date();
  
  //어제 날짜를 쿠키 소멸 날짜로 설정한다.
  expireDate.setDate( expireDate.getDate() - 1 );
  document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
 }


window.addEventListener('DOMContentLoaded', function() {    
    console.log("userId: " + getCookie('userId'))
    currentDir = document.querySelector('#current-dir')
    currentDir.innerText = getCookie('userId') + '/'
    currentPath = currentDir.innerText
    postContentsOfDirAndPrint(currentPath)
})

// dir안의 file, dir 정보 요청하고, 파일리스트 프린트
function postContentsOfDirAndPrint(toRqPath) {
    const xhr = new XMLHttpRequest()
    console.log('currentPath: '+toRqPath)
    var formdata = new FormData();
    /*
        "request" : "file_load",
        "curPath" : "디렉토리 이름"    ex > KhuKhuBox/
    */
    formdata.append("request", "file_load")
    formdata.append("user_id", getCookie('userId'))
    formdata.append("curPath", toRqPath)
    console.log('formdata: '+formdata)
    const url =""

    console.log("curPath: "+ toRqPath)
    
    xhr.open('POST', url) // 비동기 방식으로 Request 오픈
    //xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        console.log("데이터 전부 받음")
        if (xhr.status == 200) {
          console.log(xhr.response)
          var strFileList = xhr.response
          var arrayFileList = JSON.parse(strFileList)
          console.log(arrayFileList)
          printContent(arrayFileList)
        }
      } else {
        console.log("xhr response error")
      }
    }
    xhr.send(formdata) // Request 전송
}

// 디렉토리/파일 보여주기
var ctBody = document.querySelector('.c-table')
/*
    parameter: [{"File_Name": "KhuKhuBox/Q1_score.pdf", "upload_date": "2019-06-08T13:33:43.785442+09:00"}, {...}, ...]
*/
function printContent(newContents) {
    var htmlFileList = document.querySelector('.file-list')
    htmlFileList.innerHTML = ""
    console.log(newContents)
    console.log(typeof(newContents))
    for(var idx in newContents) {
        var content = newContents[idx]
        console.log(content)
        var contentName = content['File_Name']
        console.log(contentName)
        var uploadDate = content['upload_date']
        var splitPathList = contentName.split('/')
        var addElemTr = document.createElement('tr')
        addElemTr.classList.add('file-row')
        var addElemTdSelect = document.createElement('td')
        var addElemChBox = document.createElement('input')
        addElemChBox.setAttribute('type', 'checkbox')
        addElemChBox.setAttribute('name', 'check-file')
        addElemTdSelect.appendChild(addElemChBox)
        var addElemTdType = document.createElement('td')
        var addElemTdName = document.createElement('td')
        var addElemTdDate = document.createElement('td')
        addElemTdSelect.classList.add('file-select')
        addElemTdType.classList.add('file-type')
        addElemTdName.classList.add('file-name')
        addElemTdDate.classList.add('file-date')

        if(contentName[contentName.length - 1] != "/") {
            var fileName = splitPathList[splitPathList.length - 1]
            addElemChBox.setAttribute('value', fileName)
            addElemTr.appendChild(addElemTdSelect)

            addElemTdType.innerText = "파일"
            addElemTr.appendChild(addElemTdType)
            addElemTdName.innerText = fileName
            addElemTr.appendChild(addElemTdName)
            addElemTdDate.innerText = uploadDate
            addElemTr.appendChild(addElemTdDate)
            htmlFileList.appendChild(addElemTr)
        }
        else {

            var dirName = splitPathList[splitPathList.length - 2] + '/'
            addElemChBox.setAttribute('value', dirName)
            addElemTr.appendChild(addElemTdSelect)
            
            addElemTdType.innerText = "폴더"
            addElemTr.appendChild(addElemTdType)
            addElemTdName.innerText = dirName
            addElemTr.appendChild(addElemTdName)
            addElemTdDate.innerText = uploadDate
            addElemTr.appendChild(addElemTdDate)
            htmlFileList.appendChild(addElemTr)
        }
    }
}

// 디렉토리/파일 클릭 시
function ctBodyClickHandler(e) {
    if(!e.target.parentElement.classList.contains('file-row')) return
    console.log("file-row click!")
    if(currentPath != null){
        var option = document.createElement('option')
        option.text = currentPath
        option.value = currentPath
        var options = locationbtn.options
        var isOption = false
        for(var i=0; i<options.length; i++) {
            if(option.text == options[i].text) {
                isOption = true
                break
            }
        }
        if(!isOption) {
            locationbtn.add(option)
        }
    }
    var htmlFileList = document.querySelector('.file-list')
    var userClickRow = e.target.parentElement
    var fileType = userClickRow.querySelector('.file-type').innerText
    var fileName = userClickRow.querySelector('.file-name').innerText

    if(fileType=="폴더") {
        document.querySelector('#current-dir').innerText = currentPath+fileName
        currentPath = document.querySelector('#current-dir').innerText
        console.log(currentPath)
        htmlFileList.innerHTML = ""
        postContentsOfDirAndPrint(currentPath)
    }
}
ctBody.addEventListener('click', ctBodyClickHandler)

// 유저가 업로드할 파일 선택시
var btn = document.querySelector('.button')
function btnChangeEventHandler(e) {
    uploadFileName = e.target.files[0].name
    currentFilePath = currentPath + uploadFileName
    console.log(currentFilePath)
}
btn.addEventListener('change', btnChangeEventHandler)

// upload file to S3
function uploadFileToS3(url) {
  const xhr = new XMLHttpRequest()
  var file = document.querySelector('.button').files[0]
  var formData = new FormData()
  formData.append("key", file)
  formData.append('Content-Type', file.type);
  formData.append("file", uploadFileName)
  
  xhr.open('PUT', url)
  xhr.onreadystatechange = function() {
    if(xhr.status==400) {
      if(xhr.readyState==4) {
        console.log(xhr.response)
      }
    }
  }
  xhr.send(formData)
}

// 유저가 전송버튼 클릭 시
var form = document.querySelector('.file-form')
form.onsubmit = function() {
    const xhr = new XMLHttpRequest()
    console.log(currentFilePath)
    // 유저가 아무 파일로 선택하지 않고 전송버튼을 눌렀을 경우
    if(currentFilePath==undefined) {
        console.log("error: any selec file")
        return false
    }

    /*
        "request" : "file_upload",
        "file_name" : "파일이름",  ex > file.txt
        "curPath" : "디렉토리 이름" } ex > KhuKhuBox/
    */
    var formdata = new FormData();
    formdata.append("request", "file_upload")
    formdata.append("file_name", uploadFileName)
    formdata.append("user_id", getCookie('userId'))
    formdata.append("curPath", currentPath)
    const url =""

    console.log("file_name: " + uploadFileName)
    console.log("curPath: " + currentPath)

    var bucket = new AWS.S3({ params: { Bucket: albumBucketName } })
    var file = document.querySelector('.button').files[0]
    
    xhr.open('POST', url) // 비동기 방식으로 Request 오픈
    xhr.onreadystatechange = function() {
        if(xhr.status==200) {
            console.log(xhr.responseText)
            xhr.onprogress = function(evt) {
                var progressBar = document.querySelector('#progressBar')
                progressBar.value = evt.loaded/evt.total*100;
            }
            if(xhr.readyState==4) {
                var responseJson = xhr.response
                uploadFileToS3(responseJson.file_url)
                postContentsOfDirAndPrint(currentPath)
                console.log(xhr.responseText)
            }
        } else {
            console.log("xhr response error")
            console.log(xhr.statusText)
        }
    }
    xhr.send(formdata) // Request 전송

    return false //중요! false를 리턴해야 버튼으로 인한 submit이 안된다.
 }


 //다운버튼 클릭시
//다운로드 버튼 클릭시

var downbtn = document.querySelector('.download')
function btnDownClickEventHandler() {
    var chkArr = document.getElementsByName("check-file")
    var filenameArr = []
    const xhr = new XMLHttpRequest()
    var formdata = new FormData();
    for(let i=0; i < chkArr.length; i++){
        if(chkArr[i].checked == true){
            console.log(chkArr[i])  
            filenameArr.push(currentPath + chkArr[i].value)
        }    
    }
    formdata.append("request", "file_download")
    formdata.append("file_name", filenameArr)
    formdata.append("user_id", getCookie('userId'))
    formdata.append("curPath", currentPath)
    
    const url =""

    console.log("file_name: " + filenameArr[0])
    console.log("curPath: " + currentPath)
        
    xhr.open('POST', url) // 비동기 방식으로 Request 오픈
    xhr.onreadystatechange = function() {
        if(xhr.status==200) {
            console.log(xhr.responseText)
            if(xhr.readyState==4) {
                console.log(xhr.response)
                postContentsOfDirAndPrint(currentPath)
                var urllist = xhr.response['file_url'] //응답으로부터 url리스트 가져옴
                for(let i=0; i < urllist.length; i++){
                    window.open(urllist[i])
                }               
            }
        } else {
            console.log("xhr response error")
            console.log(xhr.statusText)
        }
    }
    xhr.send(formdata) // Request 전송
}
downbtn.addEventListener('click', btnDownClickEventHandler)

//삭제버튼 클릭시
var delbtn = document.querySelector('.delete')
function btnDelClickEventHandler() {
    var chkArr = document.getElementsByName("check-file")
    var filenameArr = []
    const xhr = new XMLHttpRequest()
    var formdata = new FormData();
    for(let i=0; i < chkArr.length; i++){
        if(chkArr[i].checked == true){
            console.log(chkArr[i])  
            filenameArr.push(chkArr[i].value)
        }    
    }
    formdata.append("request", "file_delete")
    formdata.append("file_name", filenameArr)
    formdata.append("user_id", getCookie('userId'))
    formdata.append("curPath", currentPath)
    
    const url =""

    console.log("file_name: " + filenameArr[0])
    console.log("curPath: " + currentPath)
        
    xhr.open('POST', url) // 비동기 방식으로 Request 오픈
    xhr.onreadystatechange = function() {
        if(xhr.status==200) {
            console.log(xhr.responseText)
            if(xhr.readyState==4) {
                console.log(xhr.response)
                postContentsOfDirAndPrint(currentPath)
            }
        } else {
            console.log("xhr response error")
            console.log(xhr.statusText)
        }
    }
    xhr.send(formdata) // Request 전송
}
delbtn.addEventListener('click', btnDelClickEventHandler)

//폴더생성버튼 클릭시
function btnMkdir(dirname) {
    const xhr = new XMLHttpRequest()
    var formdata = new FormData();
    formdata.append("request", "create_directory")
    formdata.append("user_id", getCookie('userId'))
    formdata.append("curPath", currentPath + dirname + '/')
    const url =""

    console.log("user_id" + ':' + getCookie('userId'))
    console.log("curPath: " + currentPath + dirname + '/') 
    
    xhr.open('POST', url) // 비동기 방식으로 Request 오픈
    xhr.onreadystatechange = function() {
        if(xhr.status==200) {
            console.log(xhr.responseText)
            if(xhr.readyState==4) {
                console.log(xhr.response)
                postContentsOfDirAndPrint(currentPath)
            }
        } else {
            console.log("xhr response error")
            console.log(xhr.statusText)
        }
    }
    xhr.send(formdata) // Request 전송
}
function mkdirPopup(){
    var dirname = prompt( '생성할 폴더명을 입력해주세요', '' );
    console.log(dirname)
    if(dirname != null){
        btnMkdir(dirname)
    }else{
        alert('err!')
    }
}

//URL공유버튼 클릭시
function btnShare() {
    var chkArr = document.getElementsByName("check-file")
    var filenameArr = []
    const xhr = new XMLHttpRequest()
    var formdata = new FormData();
    for(let i=0; i < chkArr.length; i++){
        if(chkArr[i].checked == true){
            console.log(chkArr[i])  
            filenameArr.push(currentPath + chkArr[i].value)
        }    
    }
    if(filenameArr.length == 0 || filenameArr.length > 1){
        return 'Please select one file'
    }
    formdata.append("request", "file_download")
    formdata.append("file_name", filenameArr[0])
    formdata.append("user_id", getCookie('userId'))
    formdata.append("curPath", currentPath)
    const url =""

    console.log("file_name: " + filenameArr[0])
    console.log("curPath: " + currentPath)
        
    xhr.open('POST', url) // 비동기 방식으로 Request 오픈 
    xhr.onreadystatechange = function() {
        if(xhr.status==200) {
            console.log(xhr.responseText)
            if(xhr.readyState==4) {
                console.log(xhr.response)
                alert("url link : " + xhr.response['file_url'])
            }
        } else {
            console.log("xhr response error")
            console.log(xhr.statusText)
        }
    }
    xhr.send(formdata) // Request 전송
    return 'sample url'
}
function sharePopup(){    
    alert( btnShare(), '' );
}

//드롭다운으로 디렉토리 이동
function btnMoveEventHandler() {
    if(locationbtn.value != 'location1'){
        currentDir = document.querySelector('#current-dir')
        currentDir.innerText = locationbtn.value
        currentPath=locationbtn.value
        postContentsOfDirAndPrint(locationbtn.value)
        console.log('moved to ' + locationbtn.value)
        locationbtn.value = 'location1'
    }    
}
locationbtn.addEventListener('click', btnMoveEventHandler)