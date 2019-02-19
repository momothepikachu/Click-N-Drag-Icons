var dragSrcEl = null;

function handleDragStart(e) {
  // Target (this) element is the source node.
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  this.classList.add('dragElem');
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  this.classList.add('dragElem');
}

function handleDragLeave(e) {
  this.classList.remove('dragElem');  // this / e.target is previous target element.
}

function handleDrop(e) {
  // this/e.target is current target element.
  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    var parent = this.parentNode;
    var dropIndex = Array.prototype.indexOf.call(parent.children, dragSrcEl);
    var thisIndex = Array.prototype.indexOf.call(parent.children, this);
    parent.removeChild(dragSrcEl);
    var dropHTML = e.dataTransfer.getData('text/html');
    if(dropIndex>thisIndex){
      this.insertAdjacentHTML('beforebegin',dropHTML);
      var dropElem = this.previousSibling;
      addDnDHandlers(dropElem);
    } else {
      this.insertAdjacentHTML('afterend',dropHTML);
      var dropElem = this.nextSibling;
      addDnDHandlers(dropElem);      
    }
  }
  this.classList.remove('dragElem');
}

function handleDragEnd(e) {
  this.classList.remove('dragElem');
}

function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragenter', handleDragEnter, false)
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);

}

var cols = document.querySelectorAll('#columns .column');
[].forEach.call(cols, addDnDHandlers);