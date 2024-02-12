Tree.Templates = Tree.Templates || {

    tree: `
        <div class="tree-wrapper">
            <div class="tree">
                <ul ref="children"></ul>
            </div>
        </div>
    `,

    node: [  
        /** NodeType 0 - folder: **/ `
        <li class="node node-folder">
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
        `,

        /** NodeType 1 - file: **/ `
        <li class="node node-file">
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
        `
    ],

    contextMenu: `
        <div class="tree-context-menu">
            <div>
                <ul ref="items">
                </ul>
            </div>
        </div>
    `,

    contextMenuItem: `
        <li>
            <button ref="button">
                <span ref="label"></span>
            </button>
        </li>
    `,

    selectionBox: `
        <div class="tree-selection-box"></div>
    `,

};