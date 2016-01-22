import React from 'react';

import Table from './Table';

class List extends React.Component {
  render() {
    const lis = Object.keys(this.props.culprits).map((url) => {
      const items = this.props.culprits[url];

      const itemLis = Object.keys(items).map((itemKey) => {
        const item = items[itemKey];

        return Object.keys(item).map((key) => {
          const value = item[key];
          const standardLozenges = value.standards.map((standard) => {
            return (<span key={standard || 'best-practice'} className="aui-lozenge aui-lozenge-complete">{standard || 'best practice'}</span>);
          });
          return (<li key={key} className="selectors-per-message">
                      <h4>{key}</h4>
                      <span className="aui-lozenge" title={value.code}>{value.origin}</span>{standardLozenges}
                      <Table rows={value.rows} />
                  </li>);
        });
      });

      return (<li key={url}>
          <h3><a href={url} target="_blank">{url}</a></h3>
          <ol className="errors-per-url" type="a">
          {itemLis}
          </ol>
      </li>);
    });

    return (
      <ol className="result-list">
      {lis}
      </ol>
    );
  }
}

List.propTypes = {
  culprits: React.PropTypes.object.isRequired,
};


export default List;
