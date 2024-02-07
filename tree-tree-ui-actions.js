Tree.Classes.TreeUI.prototype.actions = function() {}

Tree.Classes.TreeUI.prototype.addItem = function(parentNodeUI, type) {
    var parentId = !parentNodeUI ? null : parentNodeUI.model.id;
    
    var newNodeId = this.getNextAvailableNodeId();
    var node = Tree.Types.createNode(
        type || 0, 
        newNodeId, 
        Tree.Constant.NewItemNames[type], 
        '', 
        parentId
    );
    this.clearModelSelectedNodes();
    this.actionFlags.editNodeId = newNodeId;
    this.edit = true;
    node.selected = true;
    node.edit = true;
    this.model.push(node);
    this.buildModelUI();
}


Tree.Classes.TreeUI.prototype.addFolder = function(parentNodeUI) {
    if (parentNodeUI) parentNodeUI = this.getNodeFolder(parentNodeUI);
    if (parentNodeUI) parentNodeUI.model.open = true;
    this.addItem(parentNodeUI, 0);
}


Tree.Classes.TreeUI.prototype.addFile = function(parentNodeUI) {
    if (parentNodeUI) parentNodeUI = this.getNodeFolder(parentNodeUI);
    if (parentNodeUI) parentNodeUI.model.open = true;
    this.addItem(parentNodeUI, 1);
}


Tree.Classes.TreeUI.prototype.renameItem = function(nodeUI) {
    this.edit = true;
    this.actionFlags.editNodeId = nodeUI.model.id;
    nodeUI.editNode()
    this.buildModelUI();
}


Tree.Classes.TreeUI.prototype.fillClipboard = function() {
    var clipboardNodeIds = [];
    this.clipboard = [];
    for (var i=0; i<this.nodeUIs.length; i++) {
        if (!this.nodeUIs[i].model.selected) continue;
        if (clipboardNodeIds.includes(this.nodeUIs[i].model.id)) continue;

        clipboardNodeIds.push(this.nodeUIs[i].model.id);
        this.clipboard.push(JSON.stringify(this.nodeUIs[i].model));
        this.nodeUIs[i].model.selected = false;
        this.nodeUIs[i].model.highlighted = true;
        this.nodeUIs[i].model.faded = true;
        if (!this.nodeUIs[i].children) continue;
        var children = this.getNodeUIChildren(this.nodeUIs[i]);
        for (var e=0; e<children.length; e++) {
            if (clipboardNodeIds.includes(children[e].model.id)) continue;
            clipboardNodeIds.push(children[e].model.id);
            //this.clipboard.push(JSON.stringify(this.nodeUIs[i].model));
            children[e].model.selected = false;
            children[e].model.highlighted = true;
            children[e].model.faded = true;
            this.clipboard.push(JSON.stringify(children[e].model));
        }
    }
    console.log(this.clipboard);
}


Tree.Classes.TreeUI.prototype.cutItems = function() {
    this.fillClipboard();
    this.actionFlags.removeOnPaste = true;
    this.buildModelUI();
}


Tree.Classes.TreeUI.prototype.copyItems = function() {
    this.fillClipboard();
    this.actionFlags.removeOnPaste = false;
    this.buildModelUI();
}


Tree.Classes.TreeUI.prototype.pasteItems = function(parentNodeUI) {
    if (parentNodeUI) parentNodeUI = this.getNodeFolder(parentNodeUI);
    if (parentNodeUI) parentNodeUI.model.open = true;
    var partialModel = [];
    // convert the model JSON strings back to JS objects
    for (var i=0; i<this.clipboard.length; i++) {
        partialModel.push(JSON.parse(this.clipboard[i]));
    }
    // if pasting from a CUT action, then remove the selected objects from the model
    if (this.actionFlags.removeOnPaste) {
        for (var i=0; i<partialModel.length; i++) {
            var nodeUiIndex = -1;
            for (var e=0; e<this.model.length; e++) {
                if (partialModel[i].id != this.model[e].id) continue;
                nodeUiIndex = e;
                break;
            }
            if (nodeUiIndex === -1) continue;
            this.model.splice(nodeUiIndex, 1);
        }
    }
    // assign new 'parent' ids to the models that have no parents 
    for (var i=0; i<partialModel.length; i++) {
        var nodeParentFound = false;
        for (var e=0; e<partialModel.length; e++) {
            if (i == e) continue;
            if (partialModel[i].parent != partialModel[e].id) continue;
            nodeParentFound = true;
            break;
        }
        if (nodeParentFound) continue;
        partialModel[i].parent = parentNodeUI ? parentNodeUI.model.id : null;
    }
    this.clearModelSelectedNodes();
    // join the clipboard extracted model to the existing model
    this.model = this.model.concat(partialModel);
    // update the UI
    this.buildModelUI();
}


Tree.Classes.TreeUI.prototype.deleteItems = function() {
    var nodeUiIndexes = [];
    for (var i=0; i<this.nodeUIs.length; i++) {
        if (!this.nodeUIs[i].model.selected) continue;
        nodeUiIndexes.push(this.getNodeUIModelIndex(this.nodeUIs[i].model.id));
        if (!this.nodeUIs[i].model.children) continue;
        var nodeUIChildren = this.getNodeUIChildren(this.nodeUIs[i]);
        for (var e=0; e<nodeUIChildren.length; e++)
            nodeUiIndexes.push(this.getNodeUIModelIndex(nodeUIChildren[e].model.id));
    }
    for (var i=0; i<nodeUiIndexes.length; i++) {
        this.model.splice(nodeUiIndexes[i], 1);
    }
    // update the UI
    this.buildModelUI();
}


Tree.Classes.TreeUI.prototype.finishEdit = function() {
    this.clearModelSelectedNodes();
    var nodeUI = this.getNodeUI(this.actionFlags.editNodeId);
    nodeUI.model.selected = true;
    this.actionFlags.editNodeId = null;
    nodeUI.finishEdit();
    this.edit = false;
    this.buildModelUI();
}