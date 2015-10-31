const React = require('react'),
      Store = require('../store'),
      Inspector = require('react-json-inspector');

module.exports = React.createClass({
  componentDidMount: function () {
    Store.on('change', this.onChange);
  },

  componentDidUpdate: function(){
    var body = document.body, html = document.documentElement;
    var height = Math.max(body.scrollHeight, body.offsetHeight, 
      html.clientHeight, html.scrollHeight, html.offsetHeight);
    var ratio = (window.scrollY + window.innerHeight)/height;

    if(ratio > 0.8) {
      window.scrollTo(0,document.body.scrollHeight);
    }
  },

  getInitialState: function(){
    return {
      items : []
    };
  },

  onChange: function () {
    this.setState({
      items : Store.getState()
    });
  },

  render : function(){
    var noData = this.state.items.length === 0 ?
      <div>No traces yet...</div> : null; 
    var data = {};
    this.state.items.map(function(item, i){
      var dir = item.isOutbound ? "↑" : "↓";
      var json = JSON.parse(item.jsonString);
      var key = i + " - " + dir + " " + json.msg;
      if(json.collection) key += ' [' + json.collection+']';
      if(json.name) key += ' [' + json.name+']';

      if(json.method) key += ' [' + json.method+']';
      if(json.id) key += ' - ' + json.id;
      if(json.error && json.error.message) key += ' - ' + json.error.message;
      data[key] = json;
    });
    var items = <Inspector data={data} />;
    
    return (
      <ul className="network-traces">
        {items}
        {noData}
      </ul>
    )
  }
});