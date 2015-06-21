const React = require('react');
const d3 = require('d3');
const color = d3.scale.category20();
const mui = require('material-ui');
const _ = require('lodash');
const $ = require('jquery');

const {Card, CardTitle, CardActions, RaisedButton, CardHeader, Avatar, FontIcon} = mui;

let positions = {
}

let Node = React.createClass({
  render: function () {
    return (
      <g>
        <foreignObject className="node" x={this.props.x} y={this.props.y} width="300" height="300" style={{padding: "5px"}}>
          <div xmlns="http://www.w3.org/1999/xhtml">
            <Card>
              <CardHeader title={this.props.name} avatar={<Avatar><FontIcon className="material-icons">{this.props.icon}</FontIcon></Avatar>} />
              {this.linkButtons()}
            </Card>
          </div>
        </foreignObject>
        {this.links()}
      </g>
    );
    return (
      <g>
        <rect
          height={50}
          width={200}
          x={this.props.x}
          y={this.props.y}
          style={{
            "fill": color(this.props.group),
            "stroke":"#fff",
            "strokeWidth":"1.5px"
          }}/>
          <text x={this.props.x} y={(this.props.y + 10) || 0}>{this.props.name}</text>
      </g>
    )
  },

  linkButtons() {
    let links = <div />
    let buttons = [];
    _.each(_.sortBy(this.props.links, 'alias'), (link, index) => {
      buttons.push(<RaisedButton label={link.alias} key={index} ref={this.props.name + '-' + link.alias} />)

    });
    if (buttons.length > 0) {
      links = (
        <CardActions>
          {buttons}
        </CardActions>
      )
    }
    return links;
  },
  componentDidUpdate() {
    _.each(this.props.links, (link, i) => {
      let linkButton = this.refs[this.props.name + '-' + link.alias];
      if (linkButton) {
        linkButton = linkButton.getDOMNode();
        positions[this.props.name + '-' + link.alias] = {
          x1: $(linkButton).offset().left + ($(linkButton).width() / 2),
          y1: $(linkButton).offset().top + ($(linkButton).height() / 2)
        }
      }
    });
  },

  links() {
    let lines = [];
    _.each(this.props.links, (link, i) => {
      let x1 = link.source.x;
      let y1 = link.source.y;
      let position = positions[this.props.name + '-' + link.alias];
      if (position) {
        x1 = position.x1;
        y1 = position.y1;
      }
      lines.push(<line
        key={i}
        x1={x1}
        y1={y1}
        x2={link.target.x + 10 }
        y2={link.target.y + 10}
        style={{
          "stroke":"#999",
          "strokeOpacity":".6",
          "strokeWidth": "5"
        }}/>)
    });
    return lines;
  }
});

module.exports = Node;
