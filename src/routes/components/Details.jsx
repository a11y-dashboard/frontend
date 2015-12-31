import React from 'react';

class Details extends React.Component {
  render() {
    return (
        <div>
            <h2>Details for
                <span>&nbsp;{this.props.project}</span>
                <span title={this.props.absoluteTime}>&nbsp;{this.props.relativeTime}</span>
            </h2>
            <p>There are
                <span>&nbsp;{this.props.urlNumber}</span>
                &nbsp;unique URLs with a total of
                <span>&nbsp;{this.props.culpritNumber}</span>
                &nbsp;culprits on record.
                <br/>
                Please use the filter below to restrict the displayed culprits.
            </p>
            {this.props.filter}
            <div ref="spinner"></div>
            <p ref="list"></p>
        </div>
    );
  }
}

Details.propTypes = {
  project: React.PropTypes.string.isRequired,
  absoluteTime: React.PropTypes.string.isRequired,
  relativeTime: React.PropTypes.string.isRequired,
  urlNumber: React.PropTypes.number.isRequired,
  culpritNumber: React.PropTypes.number.isRequired,
  filter: React.PropTypes.element.isRequired,
};

export default Details;
