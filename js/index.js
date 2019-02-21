let dragSrcEl = null;
let dragTarget = null;
let mouseTimer;
let touchRange = {}
let touchXRange;
let touchYRange;


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

function mouseDown(e){
  mouseUp();
  this.addEventListener("mousemove", ()=>{if(mouseTimer) {clearTimeout(mouseTimer)}});
  this.addEventListener("touchcancel", ()=>{if(mouseTimer) {clearTimeout(mouseTimer)}})
  mouseTimer = setTimeout(()=>execMouseDown(this), 1000); //set timeout to fire in 1 second when the user presses/touches icon
}

function mouseUp(e){
  if(mouseTimer) {clearTimeout(mouseTimer)};
  let imgs = document.querySelectorAll('img');
  [].forEach.call(imgs, notDraggable);
}

function execMouseDown(elem){
  elem.addEventListener("touchmove", touchMove, false)
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

function removeShake(elem){
  elem.classList.remove('shaking')
}

function touchMove(e){
  dragSrcEl = this
  this.classList.add('abs')
  let pageX = e.changedTouches[0].pageX-40
  let pageY = e.changedTouches[0].pageY-40
  this.style.left = pageX +'px'
  this.style.top = pageY +'px'
  for(const i of touchYRange){
    if(pageY + 80> +i && pageY - 80< +i){
      touchXRange = Object.keys(touchRange[i]).sort((a,b)=>b-a)
      for(const j of touchXRange){
        if(pageX +80 >= +j && pageX - 80 < +j){
          dragTarget? removeShake(dragTarget) : null;
          dragSrcEl!==touchRange[i][j]? dragTarget = touchRange[i][j]: null;
          dragTarget? addShake(dragTarget): null;
          break;
        } else {
          dragTarget? removeShake(dragTarget) : null;
          dragTarget = null;
        }
      } 
      if(_.inRange(touchYRange[touchYRange.indexOf(i)+1], +i-2, +i+2)){
        continue;
      } else {
        break
      }
    } else {
      dragTarget? removeShake(dragTarget) : null;
      dragTarget = null;
    }
  }
  
}

function touchEnd(e){
  console.log(dragSrcEl, dragTarget)
  let allCols = document.querySelectorAll('.column')
  if(dragTarget && dragSrcEl && dragTarget!==dragSrcEl){
    
    let dragSrcElDiv = dragSrcEl.parentNode
    let dragTargetDiv = dragTarget.parentNode
    let dropIndex = Array.prototype.indexOf.call(allCols, dragSrcElDiv);
    let thisIndex = Array.prototype.indexOf.call(allCols, dragTargetDiv);
    let clone1 =  dragSrcElDiv.cloneNode(true);
    let clone2 = dragTargetDiv.cloneNode(true);
    allCols[dropIndex].replaceWith(clone2)
    allCols[thisIndex].replaceWith(clone1)
    clone1.children[0].removeAttribute('style')
    clone1.children[0].classList.remove('abs');
  } else {
    let dragSrcElDiv = dragSrcEl.parentNode
    let dropIndex = Array.prototype.indexOf.call(allCols, dragSrcElDiv);
    let clone1 =  dragSrcElDiv.cloneNode(true);
    allCols[dropIndex].replaceWith(clone1)
    clone1.children[0].removeAttribute('style')
    clone1.children[0].classList.remove('abs');
    console.log(clone1)
  }
  touchRange = {};
  let imgs = document.querySelectorAll('img');
  [].forEach.call(imgs, dragHandler);    
}


//listen for mouse up event on body, not just the element you originally clicked on
document.addEventListener("mouseup", mouseUp) 
document.addEventListener("touchend", mouseUp) 


function dragHandler(elem) {
  let top = elem.getBoundingClientRect().top;
  let left = elem.getBoundingClientRect().left;
  touchRange[top]? touchRange[top][left] = elem : touchRange[top] = {[left]: elem};
  touchYRange = Object.keys(touchRange).sort((a,b)=>b-a)
  elem.addEventListener("mousedown", mouseDown, false)
  elem.addEventListener("touchstart", mouseDown, false)
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragenter', handleDragEnter, false)
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);
  elem.addEventListener('touchend',touchEnd, false);
}

let imgs = document.querySelectorAll('img');
[].forEach.call(imgs, dragHandler);