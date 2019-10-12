/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
        this.json_tree = [];
        this.position = 0;
        for(let i of json)
        {
            let node = new Node(i.name, i.parent);
            this.json_tree.push(node);
        }
    //console.log(this.json_tree);

    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
        let root = this.json_tree[0];
        for(let i = 0; i < this.json_tree.length - 1; i++){
            {
                let parent_node = this.json_tree[i];
                for (let j = i + 1; j < this.json_tree.length; j++) {
                    let current_node = this.json_tree[j];
                    if (current_node.parentName === parent_node.name) {
                        parent_node.addChild(current_node);
                        current_node.parentNode = parent_node;
                    }
                }
            }
        }
        this.assignLevel(root, 0);
        this.height = 0;
        this.assignPosition(root, 0);
        //console.log(this.json_tree)
    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        node.level = level;
        for(let child of node.children){
            this.assignLevel(child,level +1);
        }

    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
        this.height = Math.max(this.height, position);
        node.position = position;
        let number_of_children = node.children.length;
        if(number_of_children>0){
            this.assignPosition(node.children[0],position);
        }
        for(let k =1; k < node.children.length; k++){
            if(this.height > position){
                this.assignPosition(node.children[k], this.height + 1);
            }
            else{
                this.assignPosition(node.children[k], position + 1);
            }
        }

    }

    /**
     * Function that renders the tree
     */
    renderTree() {
        let canvas = d3.select("body")
                    canvas.append("svg")
                    .attr("width", 1200)
                    .attr("height", 1400);
        //console.log(this.json_tree);
        let svg = d3.select("svg");
        let selection = svg.selectAll("line")
                        .data(this.json_tree);
        let lines = selection.enter()
                        .append("line");
        selection = lines.merge(selection);
        selection
            .attr("x1", (d)=> {return (d.level+1)*200})
            .attr("y1", (d)=> {return (d.position+1)*150})
            .attr("x2", (d)=> {return d.parentNode ? (d.parentNode.level+1)*200 : (d.level+1)*200;})
            .attr("y2", (d)=> {return d.parentNode ? (d.parentNode.position+1)*150 : (d.position+1)*150;});
        let nodes = svg.selectAll("nodeGroup")
            .data(this.json_tree)
        let grp = nodes.enter()
            .append("g")
            .classed("nodeGroup", true)

        nodes.exit().remove();
        nodes = grp.merge(nodes);

        nodes.append("circle")
            .attr("r", 40);

        nodes.append("text")
            .attr("class", "label")
            .text((d)=> {return d.name.toUpperCase()});

        nodes.attr("transform", (d)=>{return "translate("+[(d.level+1)*200, (d.position+1)*150]+")";});
    }

}