Tree.ContextMenu = function(treeUI, nodeUI) {

    this.treeUI = treeUI;
    this.nodeUI = nodeUI || null;
    this.items = null;
    this.refs = null;
    this.buildModelUI();
}


Tree.ContextMenu.prototype.buildModelUI = function() {
    this.refs = Tree.MarkupFactory.build(Tree.Constant.ContextMenu);
    this.items = [];
    for (var i=0; i<Tree.Constant.Operations.length; i++) {
        if (!this.nodeUI && !Tree.Constant.Operations[i].types.includes(null)) continue;
        if (this.nodeUI && !Tree.Constant.Operations[i].types.includes(this.nodeUI.model.type)) continue;
        if (Tree.Constant.Operations[i].id == 'pasteItems' && !this.treeUI.clipboard) continue;
        var item = new Tree.ContextMenuItem(this, Tree.Constant.Operations[i]);
        this.items.push(item);
        this.refs.items.appendChild(item.refs.root);
    }
}


// setup context menu mouse event
Tree.ContextMenu.prototype.itemClick = function(e, action) {
    if (this.treeUI[action]) {
        //this.treeUI.clearModelSelectedNodes();
        this.treeUI[action](this.nodeUI);
    }
}


