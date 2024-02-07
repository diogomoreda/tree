Tree.Classes.SelectionBox = function(treeUI) {
    this.treeUI = treeUI;
    this.box = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    }
    this.refs = null;
    this.buildModelUI();
}


Tree.Classes.SelectionBox.prototype.buildModelUI = function() {
    this.refs = Tree.MarkupFactory.build(Tree.Constant.selectionBoxTemplate);
    this.treeUI.refs.root.appendChild(this.refs.root);
}


Tree.Classes.SelectionBox.prototype.startSelection = function(e) {
    this.box = {
        startX: e.clientX,
        startY: e.clientY,
        x: e.clientX,
        y: e.clientY,
        w: 0,
        h: 0
    }
    this.updateElementBox(this.refs.root, this.box);
    Tree.addClass(this.refs.root, 'active');
    this.treeUI.refs.root.onmousemove = this.resizeSelection.bind(this);
    document.onmouseup = this.stopSelection.bind(this);
}


Tree.Classes.SelectionBox.prototype.resizeSelection = function(e) {
    this.box.x = e.clientX < this.box.startX ? e.clientX : this.box.startX;  
    this.box.y = e.clientY < this.box.startY ? e.clientY : this.box.startY;
    this.box.w = Math.abs(e.clientX - this.box.startX);
    this.box.h = Math.abs(e.clientY - this.box.startY);
    this.updateElementBox(this.refs.root, this.box);
}


Tree.Classes.SelectionBox.prototype.stopSelection = function(e) {
    this.treeUI.refs.root.onmousemove = null;
    document.onmouseup = null;
    this.resizeSelection(e);
    Tree.addClass(this.refs.root, 'active');
    
    for (var i=0; i<this.treeUI.nodeUIs.length; i++) {
        var nodeBox = this.getElementBox(this.treeUI.nodeUIs[i].refs.label);
        this.treeUI.nodeUIs[i].model.selected = this.boxContains(this.box, nodeBox);
    }
    this.treeUI.buildModelUI();
}


Tree.Classes.SelectionBox.prototype.updateElementBox = function(element, box) {
    element.style.left = box.x + 'px';
    element.style.top = box.y + 'px';
    element.style.width = box.w + 'px';
    element.style.height = box.h + 'px';
}


Tree.Classes.SelectionBox.prototype.boxContains = function(boxA, boxB) {
    var result = 0;
    if (boxB.x > boxA.x && boxB.x < boxA.x + boxA.w) result ++;
    if (boxB.x + boxB.w > boxA.x && boxB.x + boxB.w < boxA.x + boxA.w) result ++;
    if (boxB.y > boxA.y && boxB.y < boxA.y + boxA.h) result ++;
    if (boxB.y + boxB.h > boxA.y && boxB.y + boxB.h < boxA.y + boxA.h) result ++;
    return result >= 3;
}


Tree.Classes.SelectionBox.prototype.getElementBox = function(element) {
    return {
        x: element.offsetLeft,
        y: element.offsetTop,
        w: element.offsetWidth,
        h: element.offsetHeight
    }
}