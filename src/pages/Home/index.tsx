import React from 'react';
import './Home.scss';
import NavLink from '@/router/NavLink';

class Home extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="Home">
        <main>
          <ul className="Home-resources">
            <li>
              <NavLink to="/foo">服务端渲染展示</NavLink>
            </li>

            <li>
              <NavLink to="/quote">定制汉堡（演示）</NavLink>
            </li>
          </ul>
        </main>
        <footer>
          <div style={{ textAlign: 'center' }}>
            正在搭建中...
            <br />
            <a href="https://beian.miit.gov.cn/">闽ICP备19015680号-1</a>
          </div>
        </footer>
      </div>
    );
  }
}

export default Home;
