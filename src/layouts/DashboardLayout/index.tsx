import React from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { Link } from 'starfall';
import './styles.scss';

const routes = {
  '/': 'Home',
  '/foo': 'Foo',
  '/foo/foo-plus': 'Foo +',
};

const NavLink: React.FC<{
  path: string;
}> = ({ path, children }) => {
  const history = useHistory();
  const match = useRouteMatch({
    path,
  });

  return (
    <Link
      type="button"
      href={path}
      active={!!match?.isExact}
      onClick={e => {
        e.preventDefault();
        history.push(path);
      }}
    >
      {children}
    </Link>
  );
};

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <>
      <header>
        {Object.entries(routes).map(([path, name]) => (
          <NavLink key={path} path={path}>
            {name}
          </NavLink>
        ))}
      </header>
      <main style={{ padding: '0 50px' }}>{children}</main>
      <footer style={{ textAlign: 'center' }}>U la U la U la</footer>
    </>
  );
};

export default DashboardLayout;
