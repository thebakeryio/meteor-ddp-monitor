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
      var json = JSON.parse(item.jsonString);
      var name = i + " - " + json.msg;
      if(json.collection) name += ' [' + json.collection+']';
      if(json.name) name += ' [' + json.name+']';

      if(json.method) name += ' [' + json.method+']';
      if(json.id) name += ' - ' + json.id;
      if(json.error && json.error.message) name += ' - ' + json.error.message;
      data[name] = json;
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