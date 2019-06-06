const xhr = new XMLHttpRequest()
var content = document.querySelector('.content')
//var testBtn = document.querySelector('.testBtn')
var currentPath // 파일이름 뺀 현재 경로
var currentFilePath // 파일이름 포함한 현재 경로
var pastPathList

window.addEventListener('DOMContentLoaded', function() {
    currentPath = document.querySelector('#current-dir').innerText+"/"
    printContent(newCtt)
})

// dir안의 file, dir 정보 요청하기
function getContentsOfDir(toRqPath) {

}

// 디렉토리/파일 보여주기
var newCtt = ["abc.txt", "a/", "bcd.txt", "b/"]
var ctBody = document.querySelector('.ct-body')
function printContent(newContents) {
    var cttList = [] // list clear
    cttList = cttList.concat(newContents)
    cttList.sort()
    for(var i=0; i<cttList.length; i++) {
        contentItem = cttList[i]
        var addElemTr = document.createElement('tr')
        addElemTr.classList.add('file-row')
        var addElemTdType = document.createElement('td')
        var addElemTdName = document.createElement('td')
        var addElemTdDate = document.createElement('td')
        addElemTdType.classList.add('file-type')
        addElemTdName.classList.add('file-name')
        addElemTdDate.classList.add('file-date')
        if(contentItem.search("/")==-1) {
            var fileName = contentItem
            addElemTdType.innerText = "파일"
            addElemTr.appendChild(addElemTdType)
            addElemTdName.innerText = fileName
            addElemTr.appendChild(addElemTdName)
            addElemTdDate.innerText = "0000.00.00"
            addElemTr.appendChild(addElemTdDate)
            ctBody.appendChild(addElemTr)
        }
        else {
            var dirName = contentItem.replace("/", "")
            addElemTdType.innerText = "폴더"
            addElemTr.appendChild(addElemTdType)
            addElemTdName.innerText = dirName
            addElemTr.appendChild(addElemTdName)
            addElemTdDate.innerText = "0000.00.00"
            addElemTr.appendChild(addElemTdDate)
            ctBody.appendChild(addElemTr)
        }
    }
}

// 디렉토리/파일 클릭 시
function ctBodyClickHandler(e) {
    var userClickRow = e.target.parentElement
    var fileType = userClickRow.querySelector('.file-type').innerText
    var fileName = userClickRow.querySelector('.file-name').innerText

    if(fileType=="폴더") {
        document.querySelector('#current-dir').innerText = currentPath+fileName+"/"
        currentPath = document.querySelector('#current-dir').innerText
        console.log(currentPath)
        //ctBody.innerHTML = ""
        //printContent...
    }
}
ctBody.addEventListener('click', ctBodyClickHandler)

// move to past path
// 

// 유저가 업로드할 파일 선택시
var btn = document.querySelector('.button')
function btnChangeEventHandler(e) {
    currentFilePath = currentPath + e.target.files[0].name
    console.log(currentFilePath)
}
btn.addEventListener('change', btnChangeEventHandler)

// 유저가 전송버튼 클릭 시
var form = document.querySelector('.file-form')
form.onsubmit = function() {
    console.log(currentFilePath)
    // 유저가 아무 파일로 선택하지 않고 전송버튼을 눌렀을 경우
    if(currentFilePath==undefined) {
        console.log("error: any selec file")
        return false
    }

    const filePathObj = { filePath: currentFilePath }
    const jsonFileObj = JSON.stringify(filePathObj)
    console.log(jsonFileObj)
    const url =""
    
    xhr.open('post', url) // 비동기 방식으로 Request 오픈
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(jsonFileObj) // Request 전송
    // todo: response 받아서 front에 파일 추가해 보여주기
    xhr.onreadystatechange = function(e) {
        if(xhr.status==200) {
            console.log(xhr.responseText)
            xhr.onprogress = function(evt) {
                var progressBar = document.querySelector('#progressBar')
                progressBar.value = evt.loaded/evt.total*100;
            }
        } else {
            console.log("xhr response error")
        }
    }

    return false //중요! false를 리턴해야 버튼으로 인한 submit이 안된다.
 }