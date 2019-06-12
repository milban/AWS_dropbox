// var form = document.querySelector('.userInfo')
// form.onsubmit = function() {
//     var userId = document.querySelector('#userid').textContent
//     console.log(userId)
//     document.cookie = "userId="+userId
//     return true;
// }


function redirectToMain(url) {
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
                //postContentsOfDirAndPrint(currentPath)
                window.location.href(xhr.response.currentPath)
                //리다이렉트
            }
        } else {
            console.log("xhr response error")
            console.log(xhr.statusText)
        }
    }
    xhr.send(formdata) // Request 전송
} //리다이렉트하도록 만들기

function setCookie(cName, cValue, cDay){
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
    if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}

var btn = document.querySelector('.submit-btn')
function submitBtnHandler() {
    var userId = document.querySelector('#userid').value
    console.log(userId)
    setCookie('userId', userId, 1)
    //쿠키 설정
    //이 아래로는 토큰 받은걸로 처리하자
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
                //postContentsOfDirAndPrint(currentPath)
                var temptoken = ""
                if(temptoken!=undefined)
                redirectToMain(xhr.response.path)
            }
        } else {
            console.log("xhr response error")
            console.log(xhr.statusText)
        }
    }
    xhr.send(formdata) // Request 전송

}

btn.addEventListener('click', submitBtnHandler)