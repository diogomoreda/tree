// Namespace and structure
var Tree = Tree || {};
Tree.Constant = null;
Tree.Templates = null;
Tree.Classes = {};

// Static root methods

Tree.createNode = function(type, id, name, extension, parent) {
    var now = new Date();
    var node = {};
    node.type = type || 0;
    node.id = id;
    node.name = name || '';
    node.extension = extension || '';
    node.created = now.toISOString();
    node.modified = now.toISOString();
    node.hidden = false;
    node.disabled = false;
    node.selected = true;
    node.highlighted = false;
    node.open = false;
    node.edit = true;
    node.parent = parent || null;
    node.children = [];
    return node;
}


Tree.copyNode = function(id, _node, _parent) {
    var now = new Date();
    var node = {};
    node.type = _node.type;
    node.id = id;
    node.name = _node.name;
    node.extension = _node.extension;
    node.created = _node.created;
    node.modified = now.toISOString();
    node.hidden = false;
    node.disabled = false;
    node.selected = false;
    node.highlighted = false;
    node.open = false;
    node.edit = false;
    node.parent = _parent || null;
    if (_node.children) {
        node.children = [];
        for (var i=0; i<_node.children.length; i++) node.children[i] = _node.children[i]; 
    } else {
        node.children = null;
    }
    return node;
}


Tree.addClass = function(element, className) {
    Tree.removeClass(element, className);
    element.className = element.className.length ? element.className + ' ' + className : className;
}


Tree.removeClass = function(element, className) {
    var re = new RegExp('(^|\\s+)' + className);
    element.className = element.className.replace(re, '');
}


Tree.intToId = function(i) {
    var hex = i.toString(16).toUpperCase();
    if (hex.length > 8) hex = (i % Math.pow(2, 8)).toString(16)
    while (hex.length < 8) hex = "0" + hex;
    return hex.substring(0,4) + '-' + hex.substring(4);
}


Tree.idToInt = function(id) {
    id = id.replace(/-/, "");
    return parseInt(id, 16);
}


Tree.MarkupFactory = (function() {
    var elementWrapper = document.createElement('div');
    function _buildTemplate(htmlStr) {
        elementWrapper.innerHTML = htmlStr;
        var nodeList = elementWrapper.getElementsByTagName('*');
        var referencedNodes = {}; 
        for (var i=0; i<nodeList.length; i++) {
            for (var a=0; a<nodeList[i].attributes.length; a++) {
                if (nodeList[i].attributes[a].nodeName.toLowerCase() === 'ref') {
                    referencedNodes[nodeList[i].attributes[a].nodeValue] = nodeList[i];
                    nodeList[i].removeAttribute('ref');
                    break;
                }
            }
        }
        referencedNodes['root'] = elementWrapper.children[0];
        elementWrapper.removeChild(elementWrapper.children[0]);
        return referencedNodes;
    }
    return {
        build: _buildTemplate
    }
})()

