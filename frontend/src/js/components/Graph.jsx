const React = require('react');
const Node = require('./Node.jsx');
const d3 = require('d3');
const $ = require('jquery');
const _ = require('lodash');

let Graph = React.createClass({

  getInitialState() {
    let svgWidth = $(window).width();
    let svgHeight = $(window).height();
    let force = d3.layout.force()
      .charge(-1500)
      .linkDistance(300)
      .gravity(0.05)
      .size([svgWidth, svgHeight]);

    return {
      svgWidth: svgWidth,
      svgHeight: svgHeight,
      force: force,
      nodes: null,
      links: null
    };
  },
  componentDidMount() {
    let self = this;
    // refactor entire graph into sub component - force layout shouldn't be
    // manipulating props, though this works
    this.state.force
              .nodes(this.props.nodes)
              .links(this.props.links)
              .start();


    this.state.force.on("tick", function (tick, b, c) {
      self.forceUpdate();
    });
  },
  drawNodes() {
    let self = this;
    let nodes = this.props.nodes.map(function (node, index) {
      let icon = node.State.Running ? 'play_arrow' : 'stop';
      return (<Node
        key={index}
        x={node.x}
        y={node.y}
        name={node.Name}
        group={node.nodeGroup}
        links={_.where(self.props.links, { source: node })}
        icon={icon} />
      ) });
    return nodes;
  },
  componentDidUpdate() {
    this.state.force
      .nodes(this.props.nodes)
      .links(this.props.links).start();
    d3.selectAll('.node').data(this.props.nodes).call(this.state.force.drag);
  },
  render() {
    return (
      <div>
        <svg
          width={this.state.svgWidth}
          height={this.state.svgHeight}>
          {this.drawNodes()}
        </svg>
      </div>
    );
  }
});

module.exports = Graph;
