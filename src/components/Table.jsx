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

    //TODO: Work out what to do with the selector information
    return (
      <ol className="context-info">
      {this.props.rows.map((row) => {
        return (
          <li key={row.id}>
            {row.help_url ? (
                <a className="how-to-fix" title="How to fix this error" href={row.help_url} ref={(el) => AJS.$(el).tooltip({ gravity: 's' }) } target="_blank">
                  <span className="aui-icon aui-icon-small aui-iconfont-info">How to fix</span>
                </a>
              ) : ''
            }
            {row.context ? <pre><code className="html" ref={highlightBlock}>{row.context}</code></pre> : 'n/a'}
            <span style={{display: 'none'}}>{row.selector}</span>
            
          </li>
        );
      })}
      </ol>
    );
  }
}

Table.propTypes = {
  rows: React.PropTypes.array.isRequired,
};

export default Table;
