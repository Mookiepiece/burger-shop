import NavLink from '@/router/NavLink';
import React from 'react';
import './styles.scss';

const routes = {
  '/': 'Home',
  '/foo': 'Foo',
  '/foo/foo-plus': 'Foo +',
};

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <>
      <header>
        {Object.entries(routes).map(([path, name]) => (
          <NavLink key={path} to={path}>
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
