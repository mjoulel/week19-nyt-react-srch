// Include React
var React = require("react");

var Main = React.createClass({

  // Here we render the component
  render: function() {

    return (
      <div className="container">

        <div className="row">

          <div className="jumbotron">
            <h1>NYT Articles Search</h1>
            <a href="#/search"><button className="btn btn-default">Search</button></a>
            <a href="#/saved"><button className="btn btn-default">Saved</button></a>
          </div>

          <div className="row">
            <div className="text-center">

            </div>
          </div>

          <div className="container">

            {/* Added this.props.children to dump all of the child components into place */}
            {this.props.children}

          </div>
        </div>

      </div>
    );
  }
});

// Export the component back for use in other files
module.exports = Main;
