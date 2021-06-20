import React from 'react';
import NavLink from '@/router/NavLink';
import { RouteView } from '@/router/RouteView';
import type { Page } from '@/pages/Page.d';
import { QuoteConstateProvider, useQuoteConstate } from '@/store/constate';
import './styles.scss';

const routes = {
  '/': 'Burger Shop',
};

const QuoteLayout: Page = () => {
  return (
    <QuoteConstateProvider>
      <QuoteLayoutInner />
    </QuoteConstateProvider>
  );
};

const QuoteLayoutInner: React.FC = () => {
  const { progress } = useQuoteConstate();

  return (
    <div className="quote-layout">
      <header>
        {Object.entries(routes).map(([path, name]) => (
          <NavLink key={path} to={path}>
            {name}
          </NavLink>
        ))}
        <div style={{ height: 5, background: 'darkorange', width: progress + '%' }}></div>
      </header>
      <main>
        <RouteView />
      </main>
    </div>
  );
};

export default QuoteLayout;
