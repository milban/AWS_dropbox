var form = document.querySelector('.userInfo')
form.onsubmit = function() {
    var userId = document.querySelector('#userid').textContent
    console.log(userId)
    document.cookie = "userId="+userId
    return true;
}

// var btn = document.querySelector('.submit-btn')
// function submitBtnHandler() {
//     var userId = document.querySelector('#userid')
//     console.log(userId)
// }
// btn.addEventListener('click', submitBtnHandler)