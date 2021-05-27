import React, { useContext } from 'react';
import type { Context } from 'koa';

export const SsrContext = React.createContext<Context | null>(null);

export const useSsrContext = (): Context | null => useContext(SsrContext);
