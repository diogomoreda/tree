Tree.Classes.NodeUI = function(treeUI, nodeModel) {
    this.treeUI = treeUI;
    this.model = nodeModel;
    this.refs = null;
    this.buildModelUI();
    
}


Tree.Classes.NodeUI.prototype.buildModelUI = function() {
    this.refs = Tree.MarkupFactory.build(Tree.Templates.node[this.model.type]);
    this.refs.label.innerHTML = this.model.name;
    this.refs.labelEditor.value = this.model.name;
    this.refs.label.title = this.model.id + "\r" + this.treeUI.getNodePath(this) + "\rcreated: " + this.model.created + "\rmodified:" + this.model.modified;
    // node modifiers
    if (this.model.hidden)  Tree.addClass(this.refs.root, 'hidden');
    if (this.model.selected) Tree.addClass(this.refs.root, 'selected');
    if (this.model.highlighted)  Tree.addClass(this.refs.root, 'highlighted');
    if (this.model.open)  Tree.addClass(this.refs.root, 'open');
    if (this.model.edit) Tree.addClass(this.refs.root, 'edit');
    if (this.model.disabled) {
        Tree.addClass(this.refs.root, 'faded');
        return;
    }
    // register mouse events
    this.refs.btnIcon.onclick = this.onIconClick.bind(this);
    this.refs.btnLabel.onclick = this.onLabelClick.bind(this);
    this.refs.btnLabel.oncontextmenu = this.onLabelClick.bind(this);
    
    this.refs.labelEditor.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
    }.bind(this);

    this.refs.labelEditor.onkeydown = function(e) {
        if (this.model.edit && e.which == 13) {
            this.treeUI.finishEdit(); 
            e.stopPropagation();
            e.preventDefault();
        }
    }.bind(this);
}


// Mouse Events
Tree.Classes.NodeUI.prototype.onIconClick = function(e) {
    if (this.treeUI.edit || this.treeUI.busy) return;
    if (e.which === 1) { // LEFT mouse button
        if (this.model.type === 0) this.model.open = !this.model.open;
        this.treeUI.buildModelUI();
    } else if (e.which === 3) { // RIGHT mouse button
        this.treeUI.openContextMenu(e, this);
    }
    e.stopPropagation();
    e.preventDefault();
}


Tree.Classes.NodeUI.prototype.onLabelClick = function(e) {
    if (this.treeUI.edit || this.treeUI.busy) return;
    
    this.treeUI.clearModelSelectedNodes();
    //if (this.model.type === 0) this.model.open = true;
    this.model.selected = true;
    this.treeUI.buildModelUI();

    if (e.which === 3) { // RIGHT mouse button
        this.treeUI.openContextMenu(e, this);
    }

    e.stopPropagation();
    e.preventDefault();
}


Tree.Classes.NodeUI.prototype.toggleFolder = function(e) {
    
    
} 


Tree.Classes.NodeUI.prototype.select = function() {
    this.model.selected = true;
}


Tree.Classes.NodeUI.prototype.deselect = function() {
    this.model.selected = false;
}


Tree.Classes.NodeUI.prototype.editNode = function() {
    this.refs.labelEditor.value = this.model.name;
    this.model.selected = true;
    this.model.edit = true;
}


Tree.Classes.NodeUI.prototype.finishEdit = function(cancelChanges) {
    this.refs.labelEditor.onclick = null;
    this.refs.labelEditor.onkeydown = null;
    if (!cancelChanges) {
        var now = new Date();
        this.model.modified = now.toISOString();
        this.model.name = this.refs.labelEditor.value;
    }
    this.model.edit = false;
}