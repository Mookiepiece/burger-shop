import { useEffect, useMemo, useState } from 'react';
import constate from 'constate';
import type { Quote } from '@/types/Quote';
import Router from '@/router/Router';
import { useLocation } from 'react-router-dom';
import { useEventCallback } from 'starfall/lib/_utils/useEventCallback';
import { useGetSet, useSessionStorage } from 'react-use';
import useRequest from '@/hooks/useRequest';
import { apiQuote } from '@/apis/auth';

const quoteFlowTable = {
  '/quote/skip': {
    enter(quote: Quote) {
      return typeof quote === 'object';
    },
  },
  '/quote/lettuce': {
    enter() {
      return true;
    },
  },
  '/quote/lettucepiece': {
    enter(quote: Quote) {
      return quote.wiches.find(i => i.type === 'lettuce');
    },
  },
  '/quote/builder': {
    enter() {
      return true;
    },
  },
};

function useQuoteConstate_() {
  // const [quoteSs, setQuoteSs] = useSessionStorage<Quote>('constate_quote', {
  //   wiches: [{ type: 'lettuce' }],
  // });
  // useEffect(() => {
  //   setQuoteSs(quote);
  // }, [quote, setQuoteSs]);

  const [progress, setProgress] = useState(0);
  const [getQuote, setQuote] = useGetSet<Quote>({
    wiches: [{ type: 'lettuce' }],
  });

  const quote = getQuote();

  const [_quoteState, triggerQuote] = useRequest(async (q: Quote) => {
    return apiQuote(q).then(setQuote);
  });

  const quoteState = useMemo(
    () => ({
      value: quote,
      loading: _quoteState.loading,
      error: _quoteState.error,
    }),
    [_quoteState.error, _quoteState.loading, quote]
  );

  const location = useLocation();

  const next = useEventCallback(() => {
    const currIndex = Object.entries(quoteFlowTable).findIndex(([s]) => s === location.pathname);
    const filteredTable = Object.entries(quoteFlowTable).slice(currIndex + 1);

    const finded = filteredTable.find(([_key, { enter }]) => {
      return enter(getQuote());
    });

    if (finded) {
      Router.push(finded[0]);
      setProgress(((currIndex + 1) / Object.entries(quoteFlowTable).length) * 100);
    } else {
      Router.push('/quote');
    }
  });

  return { progress, setProgress, quoteState, setQuote, triggerQuote, next };
}

export const [QuoteConstateProvider, useQuoteConstate] = constate(useQuoteConstate_);

export const useUpdateQuoteToolkit = () => {
  const {
    quoteState: { value: quote },
  } = useQuoteConstate();
  const [localQuoteState, triggerLocalQuote] = useRequest(apiQuote, { initialState: { value: quote, loading: false } });

  return {
    localQuoteState,
    triggerLocalQuote,
  };
};

export const QuoteModifiers = {
  setLettuce: (quote: Quote, pieces: number): Quote => ({
    wiches: [
      ...quote.wiches.filter(({ type }) => type !== 'lettuce'),
      ...Array(pieces)
        .fill(0)
        .map(
          () =>
            ({
              type: 'lettuce',
            } as any)
        ),
    ],
  }),
};
