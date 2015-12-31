import React from 'react';
import hljs from 'highlight.js';

class Table extends React.Component {
  render () {
    return (
      <table className="aui">
        <thead>
          <tr>
            <th id="selector">Selector</th>
            <th id="context">Context</th>
            <th id="action">Action</th>
          </tr>
        </thead>
        <tbody>
          {this.props.rows.map((row) => {
            return (
              <tr>
                <td headers="selector">
                  <pre><code className="css">{row.selector}</code></pre>
                </td>
                <td headers="context">
                  {row.context
                    ? <pre><code className="html" ref={(block) => hljs.highlightBlock(block)}>{row.context}</code></pre>
                    : 'n/a'}
                </td>
                <td className="action" headers="action">
                  <ul className="menu">
                    {row.help_url
                      ? (
                        <li>
                          <a href={row.help_url} target="_blank">
                            <span className="aui-icon aui-icon-small aui-iconfont-info" title="Help">Help</span>
                          </a>
                        </li>
                      )
                      : ''}
                  </ul>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  rows: React.PropTypes.array.isRequired
};

export default Table;
