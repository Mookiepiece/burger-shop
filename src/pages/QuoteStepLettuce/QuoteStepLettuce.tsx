import React from 'react';
import { Button, Spin } from 'starfall';
import { useQuoteConstate } from '@/store/constate';

const QuoteStepLettuce: React.FC = () => {
  const {
    quoteState: { value: quote, loading: quoteLoading },
    triggerQuote,
    next,
  } = useQuoteConstate();

  return (
    <div>
      <Spin.Container loading={quoteLoading}>
        <div style={{ textAlign: 'center' }}>
          <h3>生菜？</h3>
          <div className="button-group">
            <Button
              style={{ width: 200 }}
              primary
              onClick={async () => {
                await triggerQuote({ ...quote, wiches: [{ type: 'lettuce' }] });
                next();
              }}
            >
              好啊
            </Button>
            <Button
              style={{ width: 200 }}
              onClick={async () => {
                await triggerQuote({ ...quote, wiches: [] });
                next();
              }}
            >
              别
            </Button>
          </div>
        </div>
      </Spin.Container>
    </div>
  );
};

export default QuoteStepLettuce;
