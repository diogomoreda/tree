var Tree = Tree || {};

Tree.Constant = {};
Tree.Constant.TreeOptions = {
    disableMultiselect: false,
    disableContextMenu: false,
    disableAddFolder: false,
    disableAddFile: false, 
    disableCopy: false,
    disableCut: false,
    disableRename: false,
    disableDelete: false,
    folderLimit: 0,
    fileLimit: 0,
    recursionLimit: 0,
};
Tree.Constant.NodeTypes = [
    /* 0: */ 'folder',
    /* 1: */ 'file', 
];
Tree.Constant.NewItemNames = [
    /* 0: */ 'new folder',
    /* 1: */ 'new file',
];
Tree.Constant.TreeTemplate = `
    <div class="tree-wrapper" ref="root">
        <div class="tree">
            <ul ref="children"></ul>
        </div>
    </div>
`;

Tree.Constant.NodeTemplate = [];  
Tree.Constant.NodeTemplate[0] = `
    <li ref="root" class="node node-folder">
        <div>
            <div class="node-face">
                <button ref="btnIcon" class="node-icon-button">
                    <span class="css-icon icon-folder"></span>
                </button>
                <button ref="btnLabel" class="node-label-button">
                    <span ref="label" class="node-label"></span>
                    <input type="text" ref="labelEditor" class="node-label-editor">
                </button>
            </div>
            <div class="node-children">
                <ul ref="children"></ul>
            </div>
        </div>
    </li>
`;
Tree.Constant.NodeTemplate[1] = `
    <li ref="root" class="node node-file">
        <div>
            <div class="node-face">
                <button ref="btnIcon" class="node-icon-button">
                    <span class="css-icon icon-file"></span>
                </button>
                <button ref="btnLabel" class="node-label-button">
                    <span ref="label" class="node-label"></span>
                    <input type="text" ref="labelEditor" class="node-label-editor">
                </button>
            </div>
        </div>
    </li>
`;

Tree.Constant.ContextMenu = `
    <div ref="root" class="tree-context-menu">
        <div>
            <ul ref="items">

            </ul>
        </div>
    </div>
`;

Tree.Constant.ContextMenuItem = `
    <li ref="root">
        <button ref="button">
            <span ref="label"></span>
        </button>
    </li>
`;

// context menu on tree area
// context menu on folder
// context menu on file


Tree.Constant.selectionBoxTemplate = `
    <div ref="root" class="tree-selection-box"></div>
`;



Tree.Constant.Operations = [
    {
        id: 'addFolder',
        title: 'Add new folder',
        sortIndex: 0,
        types: [null, 0, 1],
    },
    {
        id: 'addFile',
        title: 'Add new file',
        sortIndex: 0,
        types: [null, 0, 1],
    },
    {
        id: 'renameItem',
        title: 'Rename',
        sortIndex: 0,
        types: [0, 1],
    },
    {
        id: 'cutItems',
        title: 'Cut',
        sortIndex: 0,
        types: [0, 1],
    },
    {
        id: 'copyItems',
        title: 'Copy',
        sortIndex: 0,
        types: [0, 1],
    },
    {
        id: 'pasteItems',
        title: 'Paste',
        sortIndex: 0,
        types: [null, 0, 1],
    },
    {
        id: 'deleteItems',
        title: 'Delete',
        sortIndex: 0,
        types: [0, 1],
    },
]

Tree.Types = {};
Tree.Types.Node = {
    type: 0,
    id: "0000-0001",
    name: "folder A",
    extension: null,
    created: "30-11-2023T00:01.00",
    modified: "30-11-2023T00:01.00",
    selected: false,
    disabled: false,
    hidden: false,
    open: false,
    edit: false,
    parent: null,
    children: []
}
Tree.Types.createNode = function(type, id, name, extension, parent) {
    var node = Object.create(Tree.Types.Node);
    node.type = type || 0;
    node.id = id;
    node.name = name || '';
    node.extension = extension || '';
    node.created = new Date();
    node.modified = new Date();
    node.selected = true;
    node.disabled = false;
    node.hidden = false;
    node.open = false;
    node.edit = true;
    node.parent = parent || null;
    node.children = [];
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
    var hex = i.toString(16);
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
    elementWrapper.style.cssText = 'position: absolute; width: 0; height: 0; overflow: hidden; z-index: -1';
    document.body.appendChild(elementWrapper);

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
        // referencedNodes['root'] = elementWrapper.children[0];
        elementWrapper.removeChild(elementWrapper.children[0]);
        return referencedNodes;
    }

    return {
        build: _buildTemplate
    }
})()



Tree.Classes = {};
