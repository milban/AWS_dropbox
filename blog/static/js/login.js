var form = document.querySelector('.userInfo')
form.onsubmit = function() {
    var userId = document.querySelector('#userid')
    console.log(userId)
    //document.cookie = "userId="+userId
    return true;
}
