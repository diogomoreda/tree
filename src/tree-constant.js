Tree.Constant = Tree.Constant || {

    MaxIdValue: Math.pow(128, 2) - 1, 

    TreeOptions: {
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
    },

    NodeTypes: [
        /* 0: */ 'folder',
        /* 1: */ 'file', 
    ],

    NewItemNames: [
        /* 0: */ 'new folder',
        /* 1: */ 'new file',
    ],

    Operations: [
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
    ],

};