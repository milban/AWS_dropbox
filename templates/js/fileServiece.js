var content = document.querySelector('.content')
var testBtn = document.querySelector('.testBtn')

function testBtnClickHandler() {
    var addElem = document.createElement('ul')
    var horizonal = document.createElement('hr')
    addElem.innerHTML= '...'
    console.log(addElem)
    content.appendChild(addElem)
    content.appendChild(horizonal)
}

testBtn.addEventListener('click', testBtnClickHandler)
