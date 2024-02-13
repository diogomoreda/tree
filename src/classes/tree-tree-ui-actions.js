Tree.Classes.TreeUI.prototype.actions = function() {}


Tree.Classes.TreeUI.prototype.addItem = function(parentNodeUI, type) {
    var parentId = !parentNodeUI ? null : parentNodeUI.model.id;
    
    var newNodeId = this.getNextAvailableNodeId();
    var node = Tree.createNode(
        type || 0, 
        newNodeId, 
        Tree.Constant.NewItemNames[type], 
        '', 
        parentId || null
    );
    if (parentNodeUI) {
        parentNodeUI.model.children.push(newNodeId);
    }
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


Tree.Classes.TreeUI.prototype.finishEdit = function() {
    this.clearModelSelectedNodes();
    var nodeUI = this.getNodeUI(this.actionFlags.editNodeId);
    nodeUI.model.selected = true;
    this.actionFlags.editNodeId = null;
    nodeUI.finishEdit();
    this.edit = false;
    this.buildModelUI();
}


Tree.Classes.TreeUI.prototype.fillClipboard = function() {
    // clear the clipboard
    this.clipboard = [];
    // loop through every node in the tree
    for (var i=0; i<this.nodeUIs.length; i++) {
        // only process nodes that are selected
        if (!this.nodeUIs[i].model.selected) continue;
        // ensure that the selected node is in the lowest level of the selection hierarchy (the selected node, closest to the tree root node) 
        var selectedNodeUI = this.getNodeSelectionRoot(this.nodeUIs[i]);
        // store the value of the selected node UI parent node ID
        var selectedNodeParentId = selectedNodeUI.model.parent;
        // temporarily set the value of the selected node UI parent node ID to null
        selectedNodeUI.model.parent = null;
        // 
        var nodeList = [selectedNodeUI];
        // if the selected node contains children, get the children nodeUIs recursively, and add their references to the array
        if (selectedNodeUI.model.children) nodeList = nodeList.concat(this.getNodeUIChildren(selectedNodeUI));
        // copy data to clipboard and update nodeUI visual state
        for (var e=0; e<nodeList.length; e++) {
            // copy nodeUI references to the clipboard, as JSON strings
            this.clipboard.push(JSON.stringify(nodeList[e].model));
            // update the selected nodeUI and its children nodeUIs visual state (cut operations only)
            if (!this.actionFlags.isCutOperation) continue
            nodeList[e].model.selected = false;
            nodeList[e].model.highlighted = true;
            nodeList[e].model.disabled = true;
        }
        // restore the original value of the selected node UI parent node ID
        selectedNodeUI.model.parent = selectedNodeParentId;
    }    
    console.log('clipboard filled:', this.clipboard);
};


Tree.Classes.TreeUI.prototype.cutItems = function() {
    this.actionFlags.isCutOperation = true;
    this.fillClipboard();
    this.buildModelUI();
}


Tree.Classes.TreeUI.prototype.copyItems = function() {
    this.clearModelCutState();
    this.actionFlags.isCutOperation = false;
    this.fillClipboard();
    this.buildModelUI();
}


Tree.Classes.TreeUI.prototype.pasteItems = function(parentNodeUI) {
    if (parentNodeUI) parentNodeUI = this.getNodeFolder(parentNodeUI);
    if (parentNodeUI) parentNodeUI.model.open = true;
    // get the current moment in time
    var now = new Date();
    // create a partial model array, containing node data models
    var partialModel = [];
    // fill the partial model array with data from the clipboard
    for (var i=0; i<this.clipboard.length; i++) partialModel.push(JSON.parse(this.clipboard[i]));
    // filter the partial model through a cut or copy operation
    partialModel = this.actionFlags.isCutOperation ? this.pasteFromCut(partialModel) : this.pasteFromCopy(partialModel);
    console.log(partialModel);
    // loop trhough the partial model
    for (var i=0; i<partialModel.length; i++) {
        if (!partialModel[i].type) partialModel[i].open = true;
        // update the model timestamps
        partialModel[i].created = now.toISOString();
        partialModel[i].modified = now.toISOString();
        // assign new 'parent' ids to the models that have parent === null 
        var nodeParentFound = false;
        for (var e=0; e<partialModel.length; e++) {
            if (i == e) continue;
            if (partialModel[i].parent != partialModel[e].id) continue;
            nodeParentFound = true;
            break;
        }
        if (nodeParentFound) continue;
        partialModel[i].parent = parentNodeUI ? parentNodeUI.model.id : null;
        if (parentNodeUI) parentNodeUI.model.children.push(partialModel[i].id);
    }
    this.clearModelSelectedNodes();
    // join the clipboard extracted model to the existing model
    this.model = this.model.concat(partialModel);
    // clear the 'highlighted' and 'disabled' states for all nodes 
    this.clearModelCutState();
    // update the UI
    this.buildModelUI();
}


Tree.Classes.TreeUI.prototype.pasteFromCut = function(partialModel) {
    // clear the clipboard to disable successive paste operation from one cut
    this.clipboard = null;
    // remove the selected objects from the Tree instance model
    for (var i=0; i<partialModel.length; i++) {
        var nodeUiIndex = -1;
        for (var e=0; e<this.model.length; e++) {
            if (partialModel[i].id != this.model[e].id) continue;
            nodeUiIndex = e;
            break;
        }
        if (nodeUiIndex == -1) continue;
        this.model.splice(nodeUiIndex, 1);
    }
    return partialModel;
}


Tree.Classes.TreeUI.prototype.pasteFromCopy = function(partialModel) {
    // create a local idCtr to aid in calculating the next available nodeId, for new nodes that are copied from existing ones.
    var idCtr = 1;
    // get a local copy of all ID INT values used by the existing nodes, to aid in calculating the next available nodeId
    var usedNodeIds = this.getUsedNodeIds();
    // create an array to return the output the new models
    var output = [];

    // method to fetch models from the partialModel array using Id
    function _getNode(nodeId) {
        for (var i=0; i<partialModel.length; i++) 
            if (partialModel[i].id == nodeId) return partialModel[i]; 
        return null;
    }

    // method to recursively copy node children from the partial model, while updating their parent/children references
    function _copyNodeChildren(nodeModel) {
        var nodeChildren = [];
        for (var i=0; i<nodeModel.children.length; i++) {
            // get the next available node Id
            while (usedNodeIds.includes(idCtr)) idCtr++;
            // add it to the list of used Ids
            usedNodeIds.push(idCtr);
            // convert the id value to a string format
            var newId = Tree.intToId(idCtr);
            // get the nodeUI from the id in nodeModel.children
            var childNode = _getNode(nodeModel.children[i]);
            // generate a copy of the child Node Model: assign a new id, and assign the nodeModel as the 
            var nodeCopy = Tree.copyNode(newId, childNode, nodeModel.id);
            // update the nodeModel.children item at this index
            nodeModel.children[i] = newId;  
            // add the copied node to the output array
            nodeChildren.push(nodeCopy);
            // if the copied node also contains children, then repeat the process
            if (nodeCopy.children) {
                nodeChildren = nodeChildren.concat(_copyNodeChildren(nodeCopy));
            }
        }
        return nodeChildren;
    }
    
    for (var i=0; i<partialModel.length; i++) {
        // only process nodes that have no parent
        if (partialModel[i].parent) continue;
        // get the next available node Id
        while (usedNodeIds.includes(idCtr)) idCtr++;
        // add it to the list of used Ids
        usedNodeIds.push(idCtr);
        // convert the id value to a string format
        var newId = Tree.intToId(idCtr);
        // copy the node model into the nodeList array, the node model copy has its parent set to null
        var nodeList = [Tree.copyNode(newId, partialModel[i], null)];
        // if the selected node contains children, get the children models recursively, and create copies to add to the array
        if (nodeList[0].children) nodeList = nodeList.concat(_copyNodeChildren(nodeList[0]));
        // copy copied nodes to the output array
        for (var e=0; e<nodeList.length; e++) output.push(nodeList[e]);
    }
    // return the new copies of the models in the clipboard
    return output;
}


Tree.Classes.TreeUI.prototype.deleteItems = function() {
    var nodeRemoveList = [];
    for (var i=0; i<this.nodeUIs.length; i++) {
        // only process nodes that are selected
        if (!this.nodeUIs[i].model.selected) continue;
        // ensure that the selected node is in the lowest level of the selection hierarchy (the selected node, closest to the tree root node) 
        var selectedNodeUI = this.getNodeSelectionRoot(this.nodeUIs[i]);
        // remove the reference of the parent node, children array
        if (selectedNodeUI.model.parent) {
            var parentNodeUI = this.getNodeUI(selectedNodeUI.model.parent);
            var childIndex = parentNodeUI.model.children.indexOf(selectedNodeUI.model.id);
            if (childIndex > -1) parentNodeUI.model.children.splice(childIndex, 1);
        }
        // create a node list with the selected nodeUI + its children (recursive)
        var nodeList = [selectedNodeUI];
        if (selectedNodeUI.model.children) nodeList = nodeList.concat(this.getNodeUIChildren(selectedNodeUI));
        // fill the list with Ids of nodes to be removed
        for (var e=0; e<nodeList.length; e++) nodeRemoveList.push(nodeList[e].model.id);
    }
    // filter the nodes to be kept into a new array
    var newModel = [];
    for (var i=0; i<this.model.length; i++) {
        if (nodeRemoveList.includes(this.model[i].id)) continue;
        newModel.push(this.model[i]);
    }
    this.model = newModel;
    this.buildModelUI();
}





/** 
 *  {
 *    id: '0000-0001',           1. gets copied and becomes '0000-0007'
 *    parent: null,              2. the node copy parent is set to null 
 *    children: [                3. children are kept the same for now
 *      '0000-0002',
 *      '0000-0006'
 *    ]
 *  },
 *  {
 *    id: '0000-0002',
 *    parent: '0000-0001',       2. parent is replaced
 *    children: [
 *      '0000-0003'
 *    ]
 *  },
 *  {
 *    id: '0000-0003',
 *    parent: '0000-0002',
 *    children: [
 *      '0000-0004',
 *      '0000-0005',
 *    ]
 *  },
 *  {
 *    id: '0000-0004',
 *    parent: '0000-0003',
 *    children: null
 *  },
 *  {
 *    id: '0000-0005',
 *    parent: '0000-0003',
 *    children: null
 *  },
 *  {
 *    id: '0000-0006',
 *    parent: '0000-0001',     2. parent is replaced
 *    children: null
 *  },
 * **/
//if (rootNodeCopy.children)
//this.copyNodeChildren()
/*
Tree.Classes.TreeUI.prototype.copyNodeChildren = function(nodeModel, usedNodeIds, idCtr=1) {
    var nodeChildren = [];
    for (var i=0; i<nodeModel.children.length; i++) {
        // get the next available node Id
        while (usedNodeIds.includes(idCtr)) idCtr++;
        // add it to the list of used Ids
        usedNodeIds.push(idCtr);
        // convert the id value to a string format
        var newId = Tree.intToId(idCtr);
        // get the nodeUI from the id in nodeModel.children
        var childNodeUI = this.getNodeUI(nodeModel.children[i]);
        // generate a copy of the child Node Model: assign a new id, and assign the nodeModel as the 
        var nodeCopy = Tree.copyNode(newId, childNodeUI.model, nodeModel.id);
        // update the nodeModel.children item at this index
        nodeModel.children[i] = newId;  
        // add the copied node to the output array
        nodeChildren.push(nodeCopy);
        // if the copied node also contains children, then repeat the process
        if (nodeCopy.children) {
            nodeChildren = nodeChildren.concat(this.copyNodeChildren(nodeCopy, usedNodeIds, idCtr));
        }
    }
    return nodeChildren;
}
*/
/*
    // disable the 'highlihted' and 'disabled' states for all nodes
    this.cutItemsCancel();
    // create a local idCtr to aid in calculating the next available nodeId, for new nodes that are copied from existing ones.
    var idCtr = 1;
    // get a local copy of all ID INT values used by the existing nodes, to aid in calculating the next available nodeId
    var usedNodeIds = this.getUsedNodeIds();
    // clear the clipboard
    this.clipboard = [];
    // create an array to keep track of processed node IDs
    var clipboardNodeIds = [];
    // create a reference to the local treeUI scope 
    var _self = this;
    // method to recursively copy node children
    function copyNodeChildren(nodeModel) {
        var nodeChildren = [];
        for (var i=0; i<nodeModel.children.length; i++) {
            // get the next available node Id
            while (usedNodeIds.includes(idCtr)) idCtr++;
            // add it to the list of used Ids
            usedNodeIds.push(idCtr);
            // convert the id value to a string format
            var newId = Tree.intToId(idCtr);
            // get the nodeUI from the id in nodeModel.children
            var childNodeUI = _self.getNodeUI(nodeModel.children[i]);
            // generate a copy of the child Node Model: assign a new id, and assign the nodeModel as the 
            var nodeCopy = Tree.copyNode(newId, childNodeUI.model, nodeModel.id);
            // update the nodeModel.children item at this index
            nodeModel.children[i] = newId;  
            // add the copied node to the output array
            nodeChildren.push(nodeCopy);
            // if the copied node also contains children, then repeat the process
            if (nodeCopy.children) {
                nodeChildren = nodeChildren.concat(copyNodeChildren(nodeCopy));
            }
        }
        return nodeChildren;
    }
    // loop through every node in the tree
    for (var i=0; i<this.nodeUIs.length; i++) {
        // only process nodes that are selected
        if (!this.nodeUIs[i].model.selected) continue;
        // ensure that the selected node is in the lowest level of the selection hierarchy (the selected node, closest to the tree root node) 
        var selectedNodeUI = this.getNodeUISelectionRoot(this.nodeUIs[i]);
        // add the node id to the list of processed nodes
        if (clipboardNodeIds.includes(selectedNodeUI.model.id)) continue;
        clipboardNodeIds.push(selectedNodeUI.model.id);
        // get the next available node Id
        while (usedNodeIds.includes(idCtr)) idCtr++;
        // add it to the local list of used Ids
        usedNodeIds.push(idCtr);
        // convert the id value to an id string format 
        var newId = Tree.intToId(idCtr);
        // copy the selected node into the nodesCopy array, the node copy has its parent set to null
        var nodesCopy = [Tree.copyNode(newId, this.nodeUIs[i].model, null)]
        // if the selected node contains children, get the children nodeUIs recursively, and create copies to add to the array
        if (nodesCopy[0].children) nodesCopy = nodesCopy.concat(copyNodeChildren(nodesCopy[0]));
        // copy copied nodes to the clipboard, as JSON strings
        for (var e=0; e<nodesCopy.length; e++) this.clipboard.push(JSON.stringify(nodesCopy[e]));
        
    }
    console.log(clipboardNodeIds);
    console.log(this.clipboard);
    this.actionFlags.isCutOperation = false;
    this.buildModelUI();
    */
   /*
    // clear the clipboard
    this.clipboard = [];
    // create an array to keep track of processed node IDs
    var clipboardNodeIds = [];
    // loop through every node in the tree
    for (var i=0; i<this.nodeUIs.length; i++) {
        // only process nodes that are selected
        if (!this.nodeUIs[i].model.selected) continue;
        // ensure that the selected node is in the lowest level of the selection hierarchy (the selected node, closest to the tree root node) 
        var selectedNodeUI = this.getNodeUISelectionRoot(this.nodeUIs[i]);
        // add the node id to the list of processed nodes
        if (clipboardNodeIds.includes(selectedNodeUI.model.id)) continue;
        clipboardNodeIds.push(selectedNodeUI.model.id);
        // copy the selected node into the nodesCopy array, the node copy has its parent set to null
        var nodesCopy = [{model: Tree.copyNode(selectedNodeUI.model.id, selectedNodeUI.model, null)}];
        // if the selected node contains children, get the children nodeUIs recursively, and add their references to the array
        if (nodesCopy[0].model.children) nodesCopy = nodesCopy.concat(this.getNodeUIChildren(nodesCopy[0]));
        // copy data to clipboard and update nodeUI visual state
        for (var e=0; e<nodesCopy.length; e++) {
            // copy nodeUI references to the clipboard, as JSON strings
            this.clipboard.push(JSON.stringify(nodesCopy[e].model));
            // update the selected nodeUI and its children nodeUIs visual state
            nodesCopy[e].model.selected = false;
            nodesCopy[e].model.highlighted = true;
            nodesCopy[e].model.disabled = true;    
        }
    }
    console.log(clipboardNodeIds);
    console.log(this.clipboard);
    this.actionFlags.isCutOperation = true;
    this.buildModelUI();
    */