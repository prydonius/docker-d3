const BaseStore = require('./BaseStore');
const assign = require('object-assign');
const $ = require('jquery');
const _ = require('lodash');

let _containers = [];
$.get('/api', (data) => {
  _containers = data;
  ContainerStore.emitChange();
  setInterval(() => {
    $.get('/api', (data) => {
      ContainerStore.updateData(data);
    });
  }, 5000);
});

// Facebook style store creation.
let ContainerStore = assign({}, BaseStore, {

  // public methods used by Controller-View to operate on data
  getAll() {
    return {
      containers: _containers,
      links: this.containerLinks()
    }
  },

  updateData(data) {
    _.each(data, function(container) {
      let existing = _.find(_containers, { Name: container.Name });
      if (existing) {
        _.merge(existing, container);
      } else {
        _containers.push(container);
      }
    });
    _.each(_containers, function(container, index) {
      let stillThere = _.find(data, { Name: container.Name });
      if (stillThere == undefined) {
        _containers.splice(index, 1);
      }
    });
    ContainerStore.emitChange();
  },

  containerLinks() {
    let links = [];
    _.each(_containers, function(container, index) {
      if (container.HostConfig && container.HostConfig.Links && container.HostConfig.Links.length > 0) {
        _.each(container.HostConfig.Links, function(link) {
          let linkTo = link.split(':')[0];
          let alias = link.split('/').pop();
          links.push({ source: index, target: _.findIndex(_containers, { Name: linkTo }), alias: alias });
        });
      }
    });
    return links;
  },

});

module.exports = ContainerStore;
