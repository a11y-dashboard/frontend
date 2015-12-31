import React from 'react';

class Filter extends React.Component {
    render() {
      return (
      <form className="aui">
          <div className="aui-group">
              <div className="aui-item">
                  <strong>Filter:
                  </strong>
                  <label htmlFor="url" title="reverse domain name notation">URL</label>
                  <input id="url" className="text medium-field" name="url" placeholder="%" type="text"/>

                  <label htmlFor="standards">Standard</label>
                  <select id="standards" multiple="multiple" ref={(s) => AJS.$(s).auiSelect2() }>
                      {this.props.standards.map((standard) => {
                        return <option key={standard} value={standard || 'best-practice'}>{standard || 'best practice'}</option>;
                      })}
                  </select>

                  <aui-label for="level">Level</aui-label>
                  <aui-select id="level" name="level" placeholder="Select a level">
                      {this.props.levels.map((level) => <aui-option key={level}>{level}</aui-option>)}
                  </aui-select>

                  <div className="aui-buttons">
                      <button original-title="Search" className="aui-button aui-button-subtle search-button" type="button">
                          <span className="aui-icon aui-icon-small aui-iconfont-search">Search</span>
                      </button>
                      <a className="cancel" href="#clear">Clear</a>
                  </div>
              </div>
          </div>
      </form>);
    }
}

Filter.propTypes = {
  standards: React.PropTypes.array.isRequired,
  levels: React.PropTypes.array.isRequired,
};

export default Filter;
