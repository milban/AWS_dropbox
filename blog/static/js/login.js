
// var form = document.querySelector('.userInfo')
// form.onsubmit = function() {
//     var userId = document.querySelector('#userid').textContent
//     console.log(userId)
//     document.cookie = "userId="+userId
//     return true;
// }

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
    while(true){
        pass
    }
}
btn.addEventListener('click', submitBtnHandler)