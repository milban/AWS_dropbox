var content = document.querySelector('.content')
//var testBtn = document.querySelector('.testBtn')
filePath = 'khukhubox/'

function testBtnClickHandler() {
    var addElem = document.createElement('ul')
    var horizonal = document.createElement('hr')
    addElem.innerHTML= '...'
    console.log(addElem)
    content.appendChild(addElem)
    content.appendChild(horizonal)
}

//testBtn.addEventListener('click', testBtnClickHandler)

// 디렉토리/파일 보여주기
var cttList = ["abc.txt", "a/"]
var newCtt = ["bcd.txt", "b/"]
function printContent(newContents) {
    cttList = cttList.concat(newContents)
    cttList.sort()
    for(var i=0; i<cttList.length; i++) {
        contentItem = cttList[i]
        var addElem = document.createElement('ul')
        var horizonal = document.createElement('ul')
        horizonal.innerHTML = "<hr class=\"horizon\">"
        console.log(contentItem.search("/"))
        if(contentItem.search("/")==-1) {
            var fileName = contentItem
            addElem.innerHTML = "파일 " + fileName
            content.appendChild(addElem)
            content.appendChild(horizonal)
        }
        else {
            var dirName = contentItem.replace("/", "")
            addElem.innerText = "폴더 " + dirName
            content.appendChild(addElem)
            content.appendChild(horizonal)
        }
    }
}

printContent(newCtt)


// 파일 업로드
var progressBar
var progressCnt
function fileUpload(file) {
    var callUrl = "";
    console.log("qq")
    var xhr = new XMLHttpRequest()
    xhr.open('POST', callUrl)
    xhr.upload.onprogress = function(e) {
        var percentComplete = (e.loaded/e.total)*100
        progressBar.value = percentComplete
        progressCnt.innerHTML = parseInt(percentComplete) + "%"
    }

    xhr.onload = function() {
        var callStatus = xhr.status
        if(callStatus == 200) {
            var fileControl = document.querySelector('.file-contorl')
            var transferCmplt = document.createElement('div')
            transferCmplt.innerHTML = 'Transfer Complete'
            fileControl.appendChild(transferCmplt)
        }
        else {
            console.log('error')
        }
    }    
}
function test(){
    console.log(document.getElementsByName('file_upload_btn').value)
}
function fileup(path){
    // var file_name = document.getElementsByName('file_upload_btn');
    // console.log(filePath + path + '/' + file_name)
    // console.log(file_name)
    
}
var btn = document.querySelector('.button')
console.log(btn)
function btnChangeEventHandler(e) {
    console.log(e.target.files[0].name)
    console.log(filePath + e.target.files[0].name)
}
btn.addEventListener('change', btnChangeEventHandler)


