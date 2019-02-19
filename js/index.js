let dragSrcEl = null;
let mouseTimer;

function handleDragStart(e) {
  // Target (this) element is the source node.
  dragSrcEl = this.parentNode;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', dragSrcEl.outerHTML);
  
  // let crt = this.cloneNode(true);
  // crt.style.visibility = 'hidden';
  // e.dataTransfer.setDragImage(crt, 0, 0);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  this.classList.add('dragElem', 'shaking');
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  this.classList.add('dragElem', 'shaking');
}

function handleDragLeave(e) {
  this.classList.remove('dragElem', 'shaking');  // this / e.target is previous target element.
}

function handleDrop(e) {
  // this/e.target is current target element.
  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }
  let thisNode = this.parentNode
  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != thisNode) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    let parent = thisNode.parentNode;
    let dropIndex = Array.prototype.indexOf.call(parent.children, dragSrcEl);
    let thisIndex = Array.prototype.indexOf.call(parent.children, thisNode);
    parent.removeChild(dragSrcEl);
    let dropHTML = e.dataTransfer.getData('text/html');
    let dropElem;
    if(dropIndex>thisIndex){
      thisNode.insertAdjacentHTML('beforebegin',dropHTML);
      dropElem = thisNode.previousSibling;
    } else {
      thisNode.insertAdjacentHTML('afterend',dropHTML);
      dropElem = thisNode.nextSibling;
    }
    let newImg = dropElem.children[0]
    newImg.classList.remove('dragElem', 'shaking');
    dragHandler(newImg);
  }
  this.classList.remove('dragElem', 'shaking');
}

function handleDragEnd(e) {
  this.classList.remove('dragElem', 'shaking');
}

function mouseDown(elem){
  mouseUp();
  mouseTimer = setTimeout(()=>execMouseDown(elem), 1000); //set timeout to fire in 1 second when the user presses/touches icon
}

function mouseUp(){
  if(mouseTimer) {clearTimeout(mouseTimer)};
  let imgs = document.querySelectorAll('img');
  [].forEach.call(imgs, notDraggable);
}

function execMouseDown(elem){
  let imgs = document.querySelectorAll('img');
  [].forEach.call(imgs, draggable);
  addShake(elem);
}

function draggable(elem){
  elem.setAttribute('draggable', true);
}

function notDraggable(elem){
  elem.classList.remove('shaking');
  elem.setAttribute('draggable', false);
}

function addShake(elem){
  elem.classList.add('shaking')
}

//listen for mouse up event on body, not just the element you originally clicked on
document.addEventListener("mouseup", mouseUp) 
document.addEventListener("touchend", mouseUp) 

function dragHandler(elem) {
  elem.addEventListener("mousedown", ()=> mouseDown(elem), false)
  elem.addEventListener("touchstart", ()=> mouseDown(elem), false)
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragenter', handleDragEnter, false)
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);
}

let imgs = document.querySelectorAll('img');
[].forEach.call(imgs, dragHandler);