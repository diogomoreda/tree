Tree.ContextMenuItem = function(contextMenu, action) {
    this.contextMenu = contextMenu;
    this.model = action;
    this.refs = null;
    this.buildModelUi();
    this.refs.root.onclick = function(e) {
        if (this.model.disabled) return;
        this.contextMenu.itemClick(e, this.model.id);
        e.stopPropagation();
        e.preventDefault();
    }.bind(this);
}


Tree.ContextMenuItem.prototype.buildModelUi = function() {
    this.refs = Tree.MarkupFactory.build(Tree.Constant.ContextMenuItem);
    this.refs.label.innerHTML = this.model.title;
}