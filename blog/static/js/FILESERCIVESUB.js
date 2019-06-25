var albumBucketName = 'beanuploadtestbucket';
var bucketRegion = 'ap-northeast-2';
var IdentityPoolId = 'ap-northeast-2:ca1edf4b-0706-4e3e-906c-9f0b2f823ca5';

// AWS.config.update({
//   region: bucketRegion,
//   credentials: new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: IdentityPoolId
//   })
// });

// var s3 = new AWS.S3({
//   apiVersion: '2006-03-01',
//   params: {Bucket: albumBucketName}
// });

//var content = document.querySelector('.content')
//var testBtn = document.querySelector('.testBtn')
var currentPath // 파일이름 뺀 현재 경로
var currentFilePath // 파일이름 포함한 현재 경로
var uploadFileName // 업로드할 파일 이름
var pastPathList

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


window.addEventListener('DOMContentLoaded', function() {
    console.log("userId: " + getCookie('userId'))
    currentDir = document.querySelector('#current-dir')
    currentDir.innerText = getCookie('userId')
    currentPath = currentDir.innerText+"/"
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
    var htmlFileList = document.querySelector('.file-list')
    var userClickRow = e.target.parentElement
    var fileType = userClickRow.querySelector('.file-type').innerText
    var fileName = userClickRow.querySelector('.file-name').innerText

    if(fileType=="폴더") {
        document.querySelector('#current-dir').innerText = currentPath+fileName+"/"
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
    
    xhr.open('POST', url) // 비동기 방식으로 Request 오픈
    xhr.onreadystatechange = function() {
        if(xhr.status==200) {
            console.log(xhr.responseText)
            xhr.onprogress = function(evt) {
                var progressBar = document.querySelector('#progressBar')
                progressBar.value = evt.loaded/evt.total*100;
            }
            if(xhr.readyState==4) {
                postContentsOfDirAndPrint(currentPath)
            }
        } else {
            console.log("xhr response error")
            console.log(xhr.statusText)
        }
    }
    xhr.send(formdata) // Request 전송

    return false //중요! false를 리턴해야 버튼으로 인한 submit이 안된다.
 }

 // 여기서부터 AWS 코드
//  function downloadFile(filekey){
//     window.location.assign("https://" + albumBucketName + ".s3." + bucketRegion
//         + ".amazonaws.com/" + filekey)
// }

// function addFile(albumName) {
//     var fileName = uploadFileName;
//     var albumPhotosKey = encodeURIComponent(albumName) + '//';

//     var photoKey = albumPhotosKey + fileName;
    
//     s3.upload({
//       Key: photoKey,
//       Body: file,
//       ACL: 'public-read'
//     }, function(err, data) {
//       if (err) {
//         return alert('There was an error uploading your file: ', err.message);
//       }
//       alert('Successfully uploaded file.');
//       viewAlbum(albumName);
//     });
//   }  

//   function deleteFile(albumName, photoKey) {
//     s3.deleteObject({Key: photoKey}, function(err, data) {
//       if (err) {
//         return alert('There was an error deleting your file: ', err.message);
//       }
//       alert('Successfully deleted file.');
//       viewAlbum(albumName);
//     });
//   }

//   function createdir(albumName) {
//     albumName = albumName.trim();
//     if (!albumName) {
//       return alert('Dir names must contain at least one non-space character.');
//     }
//     if (albumName.indexOf('/') !== -1) {
//       return alert('Dir names cannot contain slashes.');
//     }
//     var albumKey = encodeURIComponent(albumName) + '/';
//     s3.headObject({Key: albumKey}, function(err, data) {
//       if (!err) {
//         return alert('Album already exists.');
//       }
//       if (err.code !== 'NotFound') {
//         return alert('There was an error creating your dir: ' + err.message);
//       }
//       s3.putObject({Key: albumKey}, function(err, data) {
//         if (err) {
//           return alert('There was an error creating your dir: ' + err.message);
//         }
//         alert('Successfully created dir.');
//         viewAlbum(albumName);
//       });
//     });
//   }

//   function deletedir(albumName) {
//     var albumKey = encodeURIComponent(albumName) + '/';
//     s3.listObjects({Prefix: albumKey}, function(err, data) {
//       if (err) {
//         return alert('There was an error deleting your dir: ', err.message);
//       }
//       var objects = data.Contents.map(function(object) {
//         return {Key: object.Key};
//       });
//       s3.deleteObjects({
//         Delete: {Objects: objects, Quiet: true}
//       }, function(err, data) {
//         if (err) {
//           return alert('There was an error deleting your dir: ', err.message);
//         }
//         alert('Successfully deleted dir.');
//         listAlbums();
//       });
//     });
//   }
//===============================================
//===============================================
//다운로드 버튼 클릭시
var downbtn = document.querySelector('.download')
function btnDownClickEventHandler() {
    var chkArr = document.getElementsByName("check-file")
    if(chkArr.length == 0){
        alert("Select files first")
    }else{
        for(var i=0; i < chkArr.length; i++){
            if(chkArr[i].checked == true){
            var downloadPath = "https://" + BucketName + ".s3." + bucketRegion + ".amazonaws.com/" 
                    + getCookie('userId') + '/' + chkArr[i].value
            //filepaths[i]에는 쿠쿠박스/ 다음이 들어있어야 함
            //ex) 선택한 파일이 khukhubox/gagak/a/b/image/jpg 일 경우, filepaths에는 gagak/a/b/image/jpg가 있어야 함
            window.location.assign(downloadPath)
            console.log(downloadPath)
            }    
        }  
    }    
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

//===========================
//===========================