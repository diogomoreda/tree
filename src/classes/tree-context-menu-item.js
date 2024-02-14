Tree.ContextMenuItem = function(contextMenu, action) {
    this.contextMenu = contextMenu;
    this.model = action;
    this.refs = null;
    this.buildModelUi();
}


Tree.ContextMenuItem.prototype.buildModelUi = function() {
    this.renderUI();
    this.registerEvents();
}


Tree.ContextMenuItem.prototype.renderUI = function() {
    this.refs = Tree.MarkupFactory.build(Tree.Templates.contextMenuItem);
    this.refs.label.innerHTML = this.model.title;
}


Tree.ContextMenuItem.prototype.registerEvents = function() {
    this.refs.root.onmousedown = Tree.preventDefaultEvent;
    this.refs.root.onclick = this.onclick.bind(this);
}


Tree.ContextMenuItem.prototype.onclick = function(e) {
    if (this.model.disabled) return;
    if (e.which !== 1) return; // only the LEFT mouse button procceds to run the action
    this.contextMenu.onItemClick(e, this.model.id);
    e.stopPropagation();
    e.preventDefault();
}