var content = document.querySelector('.content')
//var testBtn = document.querySelector('.testBtn')
var currentPath
var pastPathList

window.addEventListener('DOMContentLoaded', function() {
    currentPath = document.querySelector('#current-dir').innerText
    console.log(currentPath)
    printContent(newCtt)
})

// 디렉토리/파일 보여주기
var cttList = []
var newCtt = ["abc.txt", "a/", "bcd.txt", "b/"]
var ctBody = document.querySelector('.ct-body')
function printContent(newContents) {
    cttList = [] // list clear
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
    console.log('click')
    var userClickRow = e.target.parentElement
    var fileType = userClickRow.querySelector('.file-type').innerText
    var fileName = userClickRow.querySelector('.file-name').innerText

    if(fileType=="폴더") {
        document.querySelector('#current-dir').innerText = currentPath+"/"+fileName
        currentPath = document.querySelector('#current-dir').innerText
        console.log(currentPath)
        //ctBody.innerHTML = ""
        //printContent...
    }
}
ctBody.addEventListener('click', ctBodyClickHandler)

// move to past path
// ...
var btn = document.querySelector('.button')
console.log(btn)
function btnChangeEventHandler(e) {
    console.log(e.target.files[0].name)
    console.log(currentPath +'/'+ e.target.files[0].name)
}
btn.addEventListener('change', btnChangeEventHandler)