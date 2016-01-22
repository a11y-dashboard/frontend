import React from 'react';
import { Link } from 'react-router';

class App extends React.Component {
  render() {
    return (<div id="page">
      <header id="header" role="banner">
        <nav className="aui-header aui-dropdown2-trigger-group" role="navigation">
          <div className="aui-header-inner">
            <div className="aui-header-primary">
              <h1 id="logo" className="aui-header-logo aui-header-logo-aui">
                  <Link to="/">
                      <span className="aui-icon aui-icon-large aui-iconfont-review" style={{ 'marginTop': '4px' }}>Accessibility Dashboard logo</span>
                  </Link>
              </h1>
              <ul className="aui-nav">
                <li><a href="https://ecosystem-bamboo.internal.atlassian.com/browse/A11Y">Runner projects</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <section id="content" role="main">
        <header className="aui-page-header">
          <div className="aui-page-header-inner">
            <div className="aui-page-header-main">
              <h1>Atlassian Accessibility Dashboard</h1>
            </div>
          </div>
        </header>
        <div className="aui-page-panel">
          <div className="aui-page-panel-inner">
            <section className="aui-page-panel-content">
              {this.props.children}
            </section>
          </div>
        </div>
      </section>
      <footer id="footer" role="contentinfo">
        <section className="footer-body">
          <ul>
            <li>I &hearts; AUI</li>
          </ul>
          <div id="footer-logo"><a href="http://www.atlassian.com/" target="_blank">Atlassian</a></div>
        </section>
      </footer>
    </div>);
  }
}

App.propTypes = {
  children: React.PropTypes.object.isRequired,
};

export default App;
