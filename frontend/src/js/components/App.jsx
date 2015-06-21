const React = require('react');
const ContainerStore = require('../stores/ContainerStore');
const mui = require('material-ui');
const _ = require('lodash');
const Graph = require('./Graph.jsx');
const ThemeManager = new mui.Styles.ThemeManager();

let {RaisedButton} = mui;

let App = React.createClass({

  getInitialState() {
    return ContainerStore.getAll();
  },

  componentWillMount() {
    ContainerStore.addChangeListener(this.update);
  },

  componentWillUnmount() {
    ContainerStore.removeChangeListener(this.update);
  },

  update() {
    this.setState(() => {
      return ContainerStore.getAll();
    });
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  containersWithGroup() {
    return this.state.containers.map(function(c) {
      c.nodeGroup = c.State.Running ? 1 : 0;
      return c;
    });
  },

  render() {
    let {containers, links} = this.state;
    let graph = <div />
    if (containers.length > 0) {
      graph = <Graph nodes={this.containersWithGroup(containers)} links={links} />
    }
    return (
      <mui.AppCanvas>
        {graph}
      </mui.AppCanvas>
    );
  }

});

module.exports = App;
