import React from 'react';
import { Button } from 'starfall';
import { useMount } from 'react-use';
import type { Page } from '../Page.d';
import Router from '@/router/Router';
import { useQuoteConstate } from '@/store/constate';

export const QuoteStepSkipFlow: Page = () => {
  const { setQuote, next } = useQuoteConstate();

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h3>问答式定制？</h3>
        <div className="button-group">
          <Button style={{ width: 200 }} primary onClick={next}>
            定制
          </Button>
          <Button style={{ width: 200 }} onClick={() => Router.push('/quote/builder')}>
            跳过
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuoteStepSkipFlow;
