import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, Spin } from 'starfall';
import { useQuoteConstate, useUpdateQuoteToolkit } from '@/store/constate';
import { debounce, throttle } from '@/utils/throttle';

const QuoteBuilderSiderLettucepiece: React.FC = React.memo(function QuoteBuilderSiderLettucepiece() {
  const {
    quoteState: { value: quote },
    setQuote,
  } = useQuoteConstate();

  const [state, setState] = useState(1);

  const { localQuoteState, triggerLocalQuote: _triggerLocalQuote } = useUpdateQuoteToolkit();

  const [visible, setVisible] = useState(false);
  const onClose = () => setVisible(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const triggerLocalQuote = useCallback(debounce(_triggerLocalQuote, 300), []);
  useEffect(() => {
    triggerLocalQuote({
      wiches: [
        ...quote.wiches.filter(({ type }) => type !== 'lettuce'),
        ...Array(state)
          .fill(0)
          .map(
            () =>
              ({
                type: 'lettuce',
              } as any)
          ),
      ],
    });
  }, [quote.wiches, state, triggerLocalQuote]);

  return (
    <div>
      <Button onClick={() => setVisible(true)}>编辑生菜</Button>
      <Modal visible={visible} onClose={onClose} title="编辑生菜">
        <input value={state} onChange={e => setState(Number(e.target.value))} type="range" min="1" max="3" />

        <Spin.Container loading={localQuoteState.loading}>
          <div>{localQuoteState.value?.price}</div>
        </Spin.Container>

        <br />
        <Diffff before={quote.price} after={localQuoteState.value?.price} />
        <br />

        <Button
          disabled={!localQuoteState.value}
          loading={localQuoteState.loading}
          onClick={() => {
            setQuote(localQuoteState.value!);
            onClose();
          }}
        >
          好了
        </Button>
      </Modal>
    </div>
  );
});

type DiffffProps = {
  before?: number;
  after?: number;
};

const Diffff: React.FC<DiffffProps> = ({ before = 0, after = 0 }) => {
  return (
    <div>
      修改前：{before}，修改后：{after}， 变化：
      <span
        style={{
          color: after - before > 0 ? 'red' : after - before < 0 ? 'green' : undefined,
        }}
      >
        {after - before}
      </span>
    </div>
  );
};

export default QuoteBuilderSiderLettucepiece;
