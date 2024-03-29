Tree.Classes.TreeUI = function(treeModel) {
    this.model = treeModel;
    this.nodeUIs = null;
    this.options = Object.create(Tree.Constant.TreeOptions);

    this.busy = false;
    this.edit = false;
    this.clipboard = null;
    this.contextMenu = null;
    this.selectionBox = null;
    this.actionFlags = {
        editNodeId: null,
        isCutOperation: false,
    };
    this.refs = null;
    this.buildModelUI();
}


Tree.Classes.TreeUI.prototype.buildModelUI = function() {
    this.renderUI();
    this.registerEvents();
}


Tree.Classes.TreeUI.prototype.renderUI = function() {
     
    if (this.refs && (this.refs.root)) document.body.removeChild(this.refs.root);
    this.refs = Tree.MarkupFactory.build(Tree.Templates.tree);
    
    this.contextMenu = null;

    this.nodeUIs = [];
    for (var i=0; i<this.model.length; i++)
        this.nodeUIs.push(new Tree.Classes.NodeUI(this, this.model[i])); 

    for (var i=0; i<this.nodeUIs.length; i++) {
        if (!this.nodeUIs[i].model.parent) {
            this.refs.children.appendChild(this.nodeUIs[i].refs.root);
        } else {
            var parentNodeUI = this.getNodeUI(this.nodeUIs[i].model.parent);
            if (parentNodeUI) parentNodeUI.refs.children.appendChild(this.nodeUIs[i].refs.root);
        }
    }

    
    document.body.appendChild(this.refs.root);
    Tree.modelRenderer.render(this.model, 'TreeModel', ['created', 'extension', 'hidden']);
    if (this.actionFlags.editNodeId) this.focusNode(this.actionFlags.editNodeId);
}


Tree.Classes.TreeUI.prototype.registerEvents = function() {
    this.refs.root.oncontextmenu = Tree.preventDefaultEvent;
    if (!this.edit) this.refs.root.onmousedown = this.onClick.bind(this);
    else this.refs.root.onmousedown = this.onClickEditMode.bind(this);
}


///////////////////////////////////////////////////////////////
//
//  UI EVENTS
//
///////////////////////////////////////////////////////////////
Tree.Classes.TreeUI.prototype.onClickEditMode = function(e) {
    this.finishEdit();
    e.stopPropagation();
    e.preventDefault();
}


Tree.Classes.TreeUI.prototype.onClick = function(e) {
    //console.log('TreeUI.onclick');
    if (e.which === 1) { // LEFT mouse button
        if (this.contextMenu) this.closeContextMenu();
        this.clearModelSelectedNodes();
        this.buildModelUI();
    } else if (e.which === 3) { // RIGHT mouse button
        this.openContextMenu(e, null);
    }
    e.stopPropagation();
    e.preventDefault();
}



///////////////////////////////////////////////////////////////
//
//  CONTEXT MENU
//
///////////////////////////////////////////////////////////////
Tree.Classes.TreeUI.prototype.openContextMenu = function(e, nodeUI) {
    if (this.contextMenu) this.closeContextMenu();
    this.contextMenu = new Tree.ContextMenu(this, nodeUI);
    this.contextMenu.refs.root.style.left = e.clientX + 'px';
    this.contextMenu.refs.root.style.top = e.clientY + 'px';
    this.refs.root.appendChild(this.contextMenu.refs.root);
}


Tree.Classes.TreeUI.prototype.closeContextMenu = function() {
    this.refs.root.removeChild(this.contextMenu.refs.root);
    this.contextMenu = null;
}


///////////////////////////////////////////////////////////////
//
//  MODEL LOOKUP METHODS
//
///////////////////////////////////////////////////////////////
Tree.Classes.TreeUI.prototype.getNodeUI = function(id) {
    for (var i=0; i<this.nodeUIs.length; i++) 
        if (this.nodeUIs[i].model.id === id) return this.nodeUIs[i]; 
    return null;
}


Tree.Classes.TreeUI.prototype.getNodeUIChildren = function(nodeUI) {
    var nodeChildren = [];
    for (var i=0; i<nodeUI.model.children.length; i++) {
        var childNodeUI = this.getNodeUI(nodeUI.model.children[i]);
        nodeChildren.push(childNodeUI);
        if (childNodeUI.model.children) {
            nodeChildren = nodeChildren.concat(this.getNodeUIChildren(childNodeUI));
        }
    }
    return nodeChildren;
}


Tree.Classes.TreeUI.prototype.getNodeFolder = function(nodeUI) {
    var targetNodeUI = nodeUI;
    if (targetNodeUI.model.type !== 0 && targetNodeUI.model.parent === null) return null;
    while (targetNodeUI.model.type !== 0 && targetNodeUI.model.parent) {
        targetNodeUI = this.getNodeUI(targetNodeUI.model.parent);
    }
    return targetNodeUI;
}


Tree.Classes.TreeUI.prototype.getNodePath = function(nodeUI) {
    var steps = [];
    var targetNodeUI = nodeUI;
    while(targetNodeUI.model.parent) {
        steps.unshift(targetNodeUI.model.name);
        for (var i=0; i<this.nodeUIs.length; i++) {
            if (this.nodeUIs[i].model.id === targetNodeUI.model.parent) {
                targetNodeUI = this.nodeUIs[i];
                break;
            }
        }
    }
    steps.unshift(targetNodeUI.model.name);
    return '/' + steps.join('/');
}


Tree.Classes.TreeUI.prototype.getUsedNodeIds = function() {
    var usedNodeIds = [];
    for (var i=0; i<this.nodeUIs.length; i++)
        usedNodeIds.push(Tree.idToInt(this.nodeUIs[i].model.id));
    return usedNodeIds.sort((a, b) => { return a - b });
}


///////////////////////////////////////////////////////////////
//
//  MODEL CHANGING METHODS
//
///////////////////////////////////////////////////////////////
Tree.Classes.TreeUI.prototype.getNodeSelectionRoot = function(nodeUI) {
    var selectedNodeUI = nodeUI;
    var targetNodeUI = nodeUI;
    while (targetNodeUI.model.parent) {
        var parentNodeUI = this.getNodeUI(targetNodeUI.model.parent);
        if (parentNodeUI.model.selected) {
            selectedNodeUI.model.selected = false;
            selectedNodeUI = parentNodeUI;
        }
        targetNodeUI = parentNodeUI;
    }
    return selectedNodeUI;
}


Tree.Classes.TreeUI.prototype.focusNode = function(id) {
    var nodeUI = this.getNodeUI(id);
    nodeUI.refs.labelEditor.focus();
    nodeUI.refs.labelEditor.select();
}


Tree.Classes.TreeUI.prototype.clearModelSelectedNodes = function() {
    for (var i=0; i<this.model.length; i++) {
        this.model[i].selected = false;
        this.model[i].highlighted = false;
    } 
}


Tree.Classes.TreeUI.prototype.clearModelCutState = function() {
    for (var i=0; i<this.model.length; i++) {
        this.model[i].highlighted = false;
        this.model[i].disabled = false;
    } 
}


///////////////////////////////////////////////////////////////
//
//  MODEL CHANGING METHODS
//
///////////////////////////////////////////////////////////////
Tree.Classes.TreeUI.prototype.selectFileNode = function(nodeUI) {
    this.onFileNodeSelect(nodeUI).then(function(response) {
        for (var i=0; i<this.nodeUIs.length; i++) {
            if (this.nodeUIs[i].model.type === 0) continue;
            if (this.nodeUIs[i].model.id == nodeUI.model.id) this.nodeUIs[i].select()
            else this.nodeUIs[i].deselect()
        }
        //console.log(this.model)
        this.buildModelUI();
    }.bind(this));
}


Tree.Classes.TreeUI.prototype.onFileNodeSelect = function(nodeUI) {
    return new Promise(function(resolve) {
        resolve(true)
    });
}
