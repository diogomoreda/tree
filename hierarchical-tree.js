var treeModel = JSON.stringify([
    {
        type: 0,
        id: "00000000-0000-0000-0000-00000001",
        name: "folder A",
        extension: null,
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        open: false,
        children: [
            {
                type: 1,
                id: "00000000-0000-0000-0000-00000006",
                name: "file A1",
                extension: "",
                children: null,
                created: "30-11-2023T00:01.00",
                modified: "30-11-2023T00:01.00",
                open: false,
            },
            {
                type: 1,
                id: "00000000-0000-0000-0000-00000007",
                name: "file A2",
                extension: "",
                children: null,
                created: "30-11-2023T00:01.00",
                modified: "30-11-2023T00:01.00",
                open: false,
            },
            {
                type: 0,
                id: "00000000-0000-0000-0000-00000008",
                name: "folder A1",
                extension: null,
                children: [
                    {
                        type: 0,
                        id: "00000000-0000-0000-0000-00000009",
                        name: "folder AA1",
                        extension: null,
                        children: [
                            {
                                type: 0,
                                id: "00000000-0000-0000-0000-0000000A",
                                name: "folder AAA1",
                                extension: null,
                                children: [
                                    {
                                        type: 0,
                                        id: "00000000-0000-0000-0000-0000000B",
                                        name: "a deep folder",
                                        extension: null,
                                        children: [
                                            {
                                                type: 1,
                                                id: "00000000-0000-0000-0000-0000000D",
                                                name: "file A2",
                                                extension: "",
                                                children: null,
                                                created: "30-11-2023T00:01.00",
                                                modified: "30-11-2023T00:01.00",
                                                open: false,
                                            },
                                        ],
                                        created: "30-11-2023T00:01.00",
                                        modified: "30-11-2023T00:01.00",
                                        open: false,
                                    },
                                    {
                                        type: 1,
                                        id: "00000000-0000-0000-0000-0000000C",
                                        name: "file deep into tree",
                                        extension: "",
                                        children: null,
                                        created: "30-11-2023T00:01.00",
                                        modified: "30-11-2023T00:01.00",
                                        open: false,
                                    },
                                ],
                                created: "30-11-2023T00:01.00",
                                modified: "30-11-2023T00:01.00",
                                open: false,
                            },
                        ],
                        created: "30-11-2023T00:01.00",
                        modified: "30-11-2023T00:01.00",
                        open: false,
                    },
                ],
                created: "30-11-2023T00:01.00",
                modified: "30-11-2023T00:01.00",
                open: false,
            },
        ],
    },
    {
        type: 0,
        id: "00000000-0000-0000-0000-00000002",
        name: "folder B",
        extension: null,
        children: [

        ],
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        open: false,
    },
    {
        type: 0,
        id: "00000000-0000-0000-0000-00000003",
        name: "folder C",
        extension: null,
        children: [

        ],
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        open: false,
    },
    {
        type: 1,
        id: "00000000-0000-0000-0000-00000004",
        name: "file 1",
        extension: "",
        children: null,
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        open: false,
    },
    {
        type: 1,
        id: "00000000-0000-0000-0000-00000005",
        name: "file 2",
        extension: "",
        children: null,
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        open: false,
    },   
]);

var Tree = Tree || {};

Tree.Constant = {};
Tree.Constant.NodeTypes = [
    /* 0: */ 'folder',
    /* 1: */ 'file', 
];
Tree.Constant.TreeTemplate = `
    <div ref="root">
        <ul ref="children"></ul>
    </div>
`;
Tree.Constant.NodeTemplate = [];  
Tree.Constant.NodeTemplate[0] = `
    <li ref="root">
        <div>
            <div>
                <button ref="toggle"></button>
                <img ref="icon">
                <span ref="label"></span>
            </div>
            <div>
                <ul ref="children"></ul>
            </div>
        </div>
    </li>
`;
Tree.Constant.NodeTemplate[1] = `
    <li ref="root">
        <div>
            <div>
                <img ref="icon" src="">
                <span ref="label"></span>
            </div>
        </div>
    </li>
`;

Tree.Types = {};
Tree.Types.Node = function() {
    this.type = 0;
    this.id = '00000000-0000-0000-0000-00000000';
    this.name = '';
    this.extension = '';
    this.children = null;
    this.created = new Date();
    this.lastModified = new Date();
    this.open = false;
}


Tree.addClass = function(element, className) {
    Tree.removeClass(element, className);
    element.className = element.className.length ? element.className + ' ' + className : className;
}


Tree.removeClass = function(element, className) {
    var re = new RegExp('(^|\\s+)' + className);
    element.className = element.className.replace(re, '');
}


Tree.MarkupFactory = (function(Tree) {
    
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
})(Tree)


Tree.Classes = {};

Tree.Classes.TreeUI = function(treeModel) {
    this.model = treeModel;
    this.nodeUIs = null;
    this.refs = null;
    this.buildModelUI();
}
Tree.Classes.TreeUI.prototype.buildModelUI = function() {
    this.refs = Tree.MarkupFactory.build(Tree.Constant.TreeTemplate);
    this.nodeUIs = [];
    for (var i=0; i<this.model.length; i++) {
        var nodeUI = new Tree.Classes.NodeUI(this, this.model[i]);
        this.refs.children.appendChild(nodeUI.refs.root);
        this.nodeUIs.push(nodeUI);
    }
    document.body.appendChild(this.refs.root);
}

Tree.Classes.NodeUI = function(treeUI, nodeModel) {
    this.treeUI = treeUI;
    this.model = nodeModel;
    this.nodeUIs = null;
    this.refs = null;
    this.buildModelUI();
}
Tree.Classes.NodeUI.prototype.buildModelUI = function() {
    this.refs = Tree.MarkupFactory.build(Tree.Constant.NodeTemplate[this.model.type]);
    this.refs.icon.src = '';
    this.refs.label.innerHTML = this.model.name;
    this.refs.label.onclick = this.onNodeClick.bind(this)
    if (this.model.type === 0) {
        this.refs.toggle.onclick = this.onToggleClick.bind(this);
        if (this.model.children && (this.model.children.length)) {
            this.nodeUIs = [];
            for (var i=0; i<this.model.children.length; i++) {
                var nodeUI = new Tree.Classes.NodeUI(this.treeUI, this.model.children[i]);
                this.refs.children.appendChild(nodeUI.refs.root);
                this.nodeUIs.push(nodeUI);
            }
        }
    }
}
Tree.Classes.NodeUI.prototype.onToggleClick = function(e) {
    this.model.open = !this.model.open;
    if (this.model.open) Tree.addClass(this.refs.root, 'expanded');
    else Tree.removeClass(this.refs.root, 'expanded')
} 
Tree.Classes.NodeUI.prototype.onNodeClick = function(e) {
    console.log(this.model.name, 'clicked');
} 




Tree.instance = new Tree.Classes.TreeUI(JSON.parse(treeModel));



