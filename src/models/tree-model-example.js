/**
 * The Tree Node Model
 * {
 *  type: INT representing the node type. 
 *      - 0 represents a node container (a folder). For this type the 'extension' property is always returned null
 *      - >0 represents a unique node type. For this types the 'children' property is always returned null
 *  id: STRING representing a unique 64bit hex value, split in half by an hyphen for some reason
 *  extension: STRING representing the node type (like file types)
 *  created: STRING containing a date time in the ISO format representing the moment when the node was created
 *  created: STRING containing a date time in the ISO format representing the moment when the node was last changed
 *  hidden: BOOL that dictates if the node is to be displayed in the UI. 'true' hides the node.
 *  disabled: BOOL that dictatates if the node should bypass user interaction. 'true' disables interaction.
 *  selected: BOOL that dictates a particular visual state of the node, as a consequence of clicking on it. 
 *  highlighted: BOOL that dictates a particular visual state of the node, as a consequence of being targeted by copy/paste operations.
 *  open: BOOL that dictates a particular visual state of the node.
 *      - for nodes with type === 0, the boolean dictates if the UI is to display the node children. 'true' makes the UI display the node children.
 *      - for nodes with type >= 0, the boolean dictates if the UI is to display the associated node content, taking into consideration that its associated promise has been successfuly resolved.
 *  edit: BOOL that dictates a particular visual state of the node and also its response to user interaction. 'true' allows the user to change the node name using an input field.
 *  parent: STRING representing the 'id' of the node that contains this node, if any. If this property is null, then the node is placed in the tree root branch.
 *  children STRING[] representing the 'id' properties of the nodes contained by this node.
 * }
 */

const TreeModel = [
    { 
        type: 0,
        id: "0000-0001",
        name: "root folder at level 0",
        extension: null,
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        hidden: false,
        disabled: false,
        selected: false,
        highlighted: false,
        open: false,
        edit: false,
        parent: null,
        children: [
            "0000-0003",
            "0000-0004",
            "0000-0005",
            "0000-0006",
        ]
    },
    { 
        type: 1,
        id: "0000-0002",
        name: "root file at level 0",
        extension: null,
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        hidden: false,
        disabled: false,
        selected: false,
        highlighted: false,
        open: false,
        edit: false,
        parent: null,
        children: null,
    },
    { 
        type: 0,
        id: "0000-0003",
        name: "folder at level 1",
        extension: null,
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        hidden: false,
        disabled: false,
        selected: false,
        highlighted: false,
        open: false,
        edit: false,
        parent: "0000-0001",
        children: [
            "0000-0007",
        ]
    },
    { 
        type: 0,
        id: "0000-0004",
        name: "random empty folder at level 1",
        extension: null,
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        hidden: false,
        disabled: false,
        selected: false,
        highlighted: false,
        open: false,
        edit: false,
        parent: "0000-0001",
        children: []
    },
    { 
        type: 1,
        id: "0000-0005",
        name: "level 1 random file 1",
        extension: null,
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        hidden: false,
        disabled: false,
        selected: false,
        highlighted: false,
        open: false,
        edit: false,
        parent: "0000-0001",
        children: null,
    },
    { 
        type: 1,
        id: "0000-0006",
        name: "level 1 random file 2",
        extension: null,
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        hidden: false,
        disabled: false,
        selected: false,
        highlighted: false,
        open: false,
        edit: false,
        parent: "0000-0001",
        children: null,
    },
    { 
        type: 0,
        id: "0000-0007",
        name: "folder at level 2",
        extension: null,
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        hidden: false,
        disabled: false,
        selected: false,
        highlighted: false,
        open: false,
        edit: false,
        parent: "0000-0003",
        children: [
            "0000-0008"
        ],
    },
    { 
        type: 1,
        id: "0000-0008",
        name: "file at level 3",
        extension: null,
        created: "30-11-2023T00:01.00",
        modified: "30-11-2023T00:01.00",
        hidden: false,
        disabled: false,
        selected: false,
        highlighted: false,
        open: false,
        edit: false,
        parent: "0000-0007",
        children: null,
    },
    
]