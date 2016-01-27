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

    const enableTooltip = (el) => AJS.$(el).tooltip({ gravity: 's' });

    return (
      <ol className="context-info">
      {this.props.rows.map((row) => {
        let context = 'n/a';
        if (row.context) {
          context = <pre><code className="html" ref={highlightBlock}>{row.context}</code></pre>;
        }

        let helpUrl = null;
        if (row.help_url) {
          helpUrl = (<a
            className="how-to-fix"
            title="How to fix this error"
            href={row.help_url}
            ref={enableTooltip}
            target="_blank"
          >
            <span className="aui-icon aui-icon-small aui-iconfont-info">How to fix</span>
          </a>);
        }

        return (
          <li key={row.id}>
            {helpUrl}
            {context}
            <span className="selector">{row.selector}</span>
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
