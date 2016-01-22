import React from 'react';
import levels from '../data/levels.json';
import logger from '../logger';
import queryString from 'query-string';
import history from '../history';
import objectAssign from 'object-assign';
import _ from 'lodash';

function historyUpdate(newState) {
  setTimeout(() => {
    history.replace({
      pathname: window.location.pathname,
      search: '?' + queryString.stringify(objectAssign({}, queryString.parse(window.location.search), newState)),
    });
  });
}
const changeLevel = (e) => {
  logger.debug(`Changed level to ${e.target.value}`);
  historyUpdate({ level: e.target.value || 'error' });
};

function initLevelSelect() {
  logger.debug('init level select');
  const levelSelect = document.getElementById('level');
  if (levelSelect) {
    levelSelect.removeEventListener('change', changeLevel);
    levelSelect.addEventListener('change', changeLevel);
  }
}

const urlUpdate = _.debounce((url) => {
  logger.debug('filter URLs by', url);
  historyUpdate({ reverseDns: url || undefined });
}, 250);

class Filter extends React.Component {

  constructor() {
    super();
    this.state = {
      reverseDns: null,
    };
  }

    componentDidMount() {
      initLevelSelect();
    }

    componentDidUpdate() {
      initLevelSelect();
    }

    render() {
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
            <aui-select class="full-width-field" value={this.props.currentLevel} id="level" name="level" placeholder="Select a level">{options}</aui-select>
          </div>
        );
      }

      let standardsSelect = null;
      if (this.props.standards.length) {
        const initStandardsSelect = (select) => {
          logger.debug('init standards select');
          AJS.$(select)
            .auiSelect2()
            .off('change')
            .on('change', (e) => {
              logger.debug(`Changed standards to ${e.val}`);
              historyUpdate({ standards: e.val });
            });
        };

        const options = this.props.standards.map((standard) => {
          return <option key={standard} value={standard || 'best-practice'}>{standard || 'best practice'}</option>;
        });

        standardsSelect = (
          <div className="field-group">
            <label htmlFor="standards">Tags</label>
            <select id="standards" multiple="multiple" ref={initStandardsSelect} value={this.props.selectedStandards} onChange={() => {}} style={{width: '100%'}}>
                {options}
            </select>
          </div>
        );
      }

      const value = this.state.reverseDns === null ? this.props.reverseDns : this.state.reverseDns;

      const onUrlChange = (e) => {
        urlUpdate(e.target.value);
        this.setState({
          reverseDns: e.target.value || '',
        });
      };

      return (
        <form className="aui top-label">
          <div className="field-group">
            <label htmlFor="url" title="reverse domain name notation">Page URL</label>
            <input id="reverseDns" className="text full-width-field" name="reverseDns" ref="reverseDns" placeholder="eg. %jira%admin%" type="text" onChange={onUrlChange} value={value}/>
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
  reverseDns: React.PropTypes.string.isRequired,
  standards: React.PropTypes.array.isRequired,
  selectedStandards: React.PropTypes.array.isRequired,
  levels: React.PropTypes.array.isRequired,
  currentLevel: React.PropTypes.oneOf(levels),
};

export default Filter;
