import React, { useContext, useRef, useState } from 'react';
import { Button, Spin, Modal } from 'starfall';
import type { Page } from '../Page';
import { useQuoteConstate } from '@/store/constate';
import QuoteBuilderSiderLettucepiece from './components/QuoteBuilderSiderLettucepiece';
import QuoteBuilderSiderComment from './components/QuoteBuilderSiderComment';

import './styles.scss';
import { useMount } from 'react-use';
import { apiGetCommentKeywords } from '@/apis/auth';

const QuoteBuilderPageInitialStateContext = React.createContext<{ commentKeywords: string[] }>({ commentKeywords: [] });

const QuoteBuilderPage: Page<{
  commentKeywords: any;
}> = initialState => {
  const {
    quoteState: { value: quote },
    triggerQuote,
  } = useQuoteConstate();

  useMount(() => triggerQuote(quote));

  return (
    <QuoteBuilderPageInitialStateContext.Provider value={initialState}>
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <BurgerPreview />
        <BurgerModer />
      </div>
    </QuoteBuilderPageInitialStateContext.Provider>
  );
};

const BurgerModer: React.FC = React.memo(function BurgerModer() {
  const {
    quoteState: { value: quote },
  } = useQuoteConstate();
  const commentRef = useRef<{ value: string }>({ value: '' });
  const [receipt, setReceipt] = useState<any>();

  const { commentKeywords } = useContext(QuoteBuilderPageInitialStateContext);

  return (
    <div>
      <QuoteBuilderSiderLettucepiece />
      <QuoteBuilderSiderComment initialState={commentKeywords} ref={commentRef} />
      <Button primary onClick={() => setReceipt({ ...quote, comment: commentRef.current?.value })}>
        付款
      </Button>
      <ReceiptModal receipt={receipt} onClose={() => setReceipt(undefined)} />
    </div>
  );
});

const BurgerPreview: React.FC = React.memo(function BurgerPreview() {
  const {
    quoteState: { value: quote, loading: quoteLoading },
  } = useQuoteConstate();
  const wiches = quote.wiches;

  return (
    <div className="burger-preview">
      <div className="burger-preview__header"></div>
      {wiches.map((wich, index) => {
        if (wich.type === 'lettuce') {
          return <div key={JSON.stringify(wich) + index} className="burger-preview__lettuce"></div>;
        }
      })}
      <div className="burger-preview__footer"></div>
      <div style={{ marginTop: 'auto' }}>
        <Spin.Container loading={quoteLoading}>价格：{quote.price}</Spin.Container>
      </div>
    </div>
  );
});

const ReceiptModal: React.FC<{
  receipt: any;
  onClose: () => void;
}> = ({ receipt, onClose }) => {
  return (
    <Modal visible={!!receipt} onClose={onClose} title="订单信息">
      {JSON.stringify(receipt || {}, null, 4)}
      <p>演示结束</p>
    </Modal>
  );
};
QuoteBuilderPage.getInitialProps = async () => {
  const commentKeywords = await apiGetCommentKeywords();

  return { commentKeywords };
};
export default QuoteBuilderPage;
