import React from 'react';
import hljs from 'highlight.js';

hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));
hljs.registerLanguage('html', require('highlight.js/lib/languages/xml'));

require('highlight.js/styles/default.css');

hljs.configure({
  languages: ['html', 'css'],
});

class Table extends React.Component {
  render() {
    const highlightBlock = (block) => {
      if (block) {
        hljs.highlightBlock(block);
      }
    };

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
              <tr key={row.id}>
                <td headers="selector">
                  <pre><code className="css" ref={highlightBlock}>{row.selector}</code></pre>
                </td>
                <td headers="context">
                  {row.context
                    ? <pre><code className="html" ref={highlightBlock}>{row.context}</code></pre>
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
  rows: React.PropTypes.array.isRequired,
};

export default Table;
