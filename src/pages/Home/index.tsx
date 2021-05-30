import React from 'react';
import logo from './react.svg';
import './Home.scss';
import { Link } from 'react-router-dom';

class Home extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="Home">
        <div className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
        </div>
        <ul className="Home-resources">
          <li>
            <Link to="/">home</Link>
          </li>
          <li>
            <Link to="/foo">foo</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Home;
