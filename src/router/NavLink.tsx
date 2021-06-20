import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Link } from 'starfall';
import Router from './Router';

const NavLink: React.FC<{
  to: string;
}> = ({ to, children }) => {
  const match = useRouteMatch({
    path: to,
  });

  return (
    <Link
      type="button"
      href={to}
      active={!!match?.isExact}
      onClick={e => {
        e.preventDefault();
        Router.push(to);
      }}
    >
      {children}
    </Link>
  );
};

export default NavLink;
