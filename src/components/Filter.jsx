import React from 'react';
import levels from '../data/levels.json';
import logger from '../logger';
import { browserHistory } from 'react-router';
import serialize from 'form-serialize';

class Filter extends React.Component {

  constructor() {
    super();
    this.state = {
      reverseDns: null,
    };
  }

    onFormSubmit(e) {
      e.preventDefault();
      const query = serialize(e.target);
      browserHistory.push({
        pathname: window.location.pathname,
        search: `?${query}`,
      });
    }

    render() {
      logger.debug('rendering filter');

      let levelSelect = null;
      if (this.props.levels.length) {
        const options = this.props.levels.map((level) => {
          const extraAttrs = {};
          if (this.props.currentLevel === level) {
            extraAttrs.selected = 'selected';
          }
          return <aui-option key={level} {...extraAttrs}>{level}</aui-option>;
        });

        levelSelect = (
          <div className="field-group">
            <aui-label for="level">Error level</aui-label>
            <aui-select
              class="full-width-field"
              value={this.props.currentLevel}
              id="level"
              name="level"
              placeholder="Select a level"
            >{options}</aui-select>
          </div>
        );
      }

      let standardsSelect = null;
      if (this.props.standards.length) {
        const checkboxes = this.props.standards.map((standard) => {
          const key = standard || 'best-practice';
          const value = standard || 'best practice';
          const checked = this.props.selectedStandards.indexOf(key) !== -1;
          return (<div key={key} className="checkbox">
                    <input
                      className="checkbox"
                      type="checkbox"
                      name="standard"
                      defaultChecked={checked}
                      value={key}
                      id={key}
                    />
                    <label htmlFor={key}>{value}</label>
                  </div>);
        });

        standardsSelect = (
            <fieldset className="group">
                 <legend><span>Tags</span></legend>
                 {checkboxes}
             </fieldset>
        );
      }

      return (
        <form className="aui top-label" onSubmit={this.onFormSubmit}>
          <div className="field-group">
            <label htmlFor="url" title="Use % as a wildcard">Page URL</label>
            <input
              id="url"
              className="text full-width-field"
              name="url"
              placeholder="eg. %jira%admin%"
              type="text"
              defaultValue={this.props.url}
            />
          </div>
          {levelSelect}
          {standardsSelect}
          <div className="buttons-container">
            <div className="buttons">
              <button className="aui-button aui-button-primary submit">Update</button>
            </div>
          </div>
        </form>
      );
    }
}

Filter.propTypes = {
  url: React.PropTypes.string.isRequired,
  standards: React.PropTypes.array.isRequired,
  selectedStandards: React.PropTypes.array.isRequired,
  levels: React.PropTypes.array.isRequired,
  currentLevel: React.PropTypes.oneOf(levels),
};

export default Filter;
