import React, { useState } from 'react';
import { Button, Spin } from 'starfall';
import { QuoteModifiers, useQuoteConstate } from '@/store/constate';

const QuoteStepLettucepiece: React.FC = () => {
  const {
    quoteState: { value: quote, loading: quoteLoading },
    triggerQuote,
    next,
  } = useQuoteConstate();

  const [state, setState] = useState(1);

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h3>生菜要几片？</h3>
        <Spin.Container loading={quoteLoading}>
          <div>
            <input value={state} onChange={e => setState(Number(e.target.value))} type="range" min="1" max="3" />
          </div>
          <Button
            onClick={async () => {
              await triggerQuote(QuoteModifiers.setLettuce(quote, state));
              next();
            }}
          >
            够了
          </Button>
        </Spin.Container>
      </div>
    </div>
  );
};

export default QuoteStepLettucepiece;
