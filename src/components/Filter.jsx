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

    onClearClick(e) {
      e.preventDefault();
      this.setState({
        reverseDns: '',
      });
      historyUpdate({ reverseDns: null });
    }

    render() {
      let selectElement = null;
      if (this.props.levels.length) {
        const options = this.props.levels.map((level) => {
          const extraAttrs = {};
          if (this.props.currentLevel === level) {
            extraAttrs.selected = 'selected';
          }
          return <aui-option key={level} {...extraAttrs}>{level}</aui-option>;
        });

        selectElement = (
          <span>
            <aui-label for="level">Level</aui-label>
            <aui-select value={this.props.currentLevel} id="level" name="level" placeholder="Select a level">{options}</aui-select>
          </span>
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

        standardsSelect = (<span>
                            <label htmlFor="standards">Standard</label>
                            <select id="standards" multiple="multiple" ref={initStandardsSelect} value={this.props.selectedStandards} onChange={() => {}}>
                                {options}
                            </select>
                          </span>);
      }

      const value = this.state.reverseDns === null ? this.props.reverseDns : this.state.reverseDns;

      const onUrlChange = (e) => {
        urlUpdate(e.target.value);
        this.setState({
          reverseDns: e.target.value || '',
        });
      };

      let reset = null;
      if (value) {
        reset = (<a className="cancel" href="#reset" onClick={this.onClearClick.bind(this)}>Reset</a>);
      }

      return (
      <form className="aui">
          <div className="aui-group">
              <div className="aui-item">
                  <strong>Filter:
                  </strong>
                  <label htmlFor="url" title="reverse domain name notation">Reverse DNS</label>
                  <input id="reverseDns" className="text medium-field" name="reverseDns" ref="reverseDns" placeholder="%" type="text" onChange={onUrlChange} value={value}/>
                  <div className="aui-buttons">
                      {reset}
                  </div>
                  {selectElement}
                  {standardsSelect}
              </div>
          </div>
      </form>);
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
