const d3 = require('d3');

let nodes = [
    {
        "name": "Creighton Hospital"
    },
    {
        "name": "Heart Hospital"
    },
    {
        "name": "Marshall Regional Medical Center"
    },
    {
        "name": "McKennan Hospital & University Health Center"
    },
    {
        "name": "Queen of Peace Hospital"
    },
    {
        "name": "Sacred Heart Hospital"
    },
    {
        "name": "St. Luke's Hospital"
    },
    {
        "name": "St. Mary's Hospital"
    },
    {
        "name": "Milbank Area Hospital"
    },
    {
        "name": "Pipestone County Medical Center"
    },
    {
        "name": "St. Michael's Hospital"
    },
    {
        "name": "Wagner Community Memorial Hospital"
    }
];

let links = [
//     {
//         "source": 1,
//         "target": 7
//     },
//     {
//         "source": 3,
//         "target": 1
//     },
//     {
//         "source": 3,
//         "target": 9
//     },
//     {
//         "source": 6,
//         "target": 5
//     },
//     {
//         "source": 6,
//         "target": 3
//     },
//     {
//         "source": 10,
//         "target": 3
//     },
//     {
//         "source": 11,
//         "target": 3
//     }
];

/* Set the diagrams Height & Width */
    var h = 500, w = 950;
/* Set the color scale we want to use */
    var color = d3.scale.category20();
/* Establish/instantiate an SVG container object */
    var svg = d3.select("body")
                    .append("svg")
                    .attr("height",h)
                    .attr("width",w);
/* Build the directional arrows for the links/edges */
        svg.append("svg:defs")
                    .selectAll("marker")
                    .data(["end"])
                    .enter().append("svg:marker")
                    .attr("id", String)
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 15)
                    .attr("refY", -1.5)
                    .attr("markerWidth", 6)
                    .attr("markerHeight", 6)
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", "M0,-5L10,0L0,5");
/* Pre-Load the json data using the queue library */
makeDiag(null, nodes, links);
/* Define the main worker or execution function */
function makeDiag(error, nodes, links) {
    /* Draw the node labels first */
   var texts = svg.selectAll("text")
                    .data(nodes)
                    .enter()
                    .append("text")
                    .attr("fill", "black")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "10px")
                    .text(function(d) { return d.name; });
    /* Establish the dynamic force behavor of the nodes */
    var force = d3.layout.force()
                    .nodes(nodes)
                    .links(links)
                    .size([w,h])
                    .linkDistance([250])
                    .charge([-1500])
                    .gravity(0.3)
                    .start();
    /* Draw the edges/links between the nodes */
    var edges = svg.selectAll("line")
                    .data(links)
                    .enter()
                    .append("line")
                    .style("stroke", "#ccc")
                    .style("stroke-width", 1)
                    .attr("marker-end", "url(#end)");
    /* Draw the nodes themselves */
    var nodes = svg.selectAll("rect")
                    .data(nodes)
                    .enter()
                    .append("rect")
                    .attr("width", 50)
                    .attr("height", 50)
                    .attr("opacity", 0.5)
                    .style("fill", function(d,i) { return d3.rgb('blue'); })
                    .call(force.drag);
    /* Run the Force effect */
    force.on("tick", function() {
               edges.attr("x1", function(d) { return d.source.x + 25; })
                    .attr("y1", function(d) { return d.source.y + 25; })
                    .attr("x2", function(d) { return d.target.x + 25; })
                    .attr("y2", function(d) { return d.target.y + 25; });
               nodes.attr("x", function(d) { return d.x; })
                    .attr("y", function(d) { return d.y; })
               texts.attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                        });
               }); // End tick func
}; // End makeDiag worker func

