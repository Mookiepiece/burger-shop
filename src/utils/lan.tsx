import { useEffect, useState } from 'react';
import Mitt from 'starfall/lib/_utils/mitt';

function compareArray(oldDeps: any[], newDeps: any[]) {
  return oldDeps.length !== newDeps.length || newDeps.some((v, i) => !Object.is(oldDeps[i], v));
}

const lan = <T extends any>(initialState: T) => {
  const mitt = Mitt<{ UPDATE: undefined }>();

  let model = initialState;

  const getModel = () => model;

  const effect = <FN extends (_model: T) => T>(fn: FN) => {
    return () => {
      const _model = getModel();
      model = fn(_model);
      mitt.emit('UPDATE', undefined);
    };
  };

  function subscribe(callback: (slice: T) => void): () => void;
  function subscribe<S extends any[]>(callback: (slice: S) => void, selector: (model: T) => S): () => void;
  function subscribe<S extends any[]>(callback: (slice: S) => void, selector?: (model: T) => S): () => void {
    let cachedSlice: S | [] = selector?.(model) ?? [];
    const subscribeCallback = () => {
      if (!selector) {
        (callback as any)(model);
      } else {
        const newDeps = selector(model);
        if (compareArray(cachedSlice, newDeps)) {
          callback(newDeps);
        }
        cachedSlice = newDeps;
      }
    };
    mitt.on('UPDATE', subscribeCallback);
    return function unsubscribe() {
      mitt.off('UPDATE', subscribeCallback);
    };
  }

  /**
   * conditional selector is not supported because useEffect's deps is []
   */
  const useModel = <S extends any[]>(selector?: (model: T) => S) => {
    const [state, setState] = useState<T | S>(() => selector?.(model) ?? model);

    useEffect(() => {
      setState(() => selector?.(model) ?? model);
      const unsubscribe = subscribe<S>(setState, selector as any);
      return () => unsubscribe();
    }, []);

    return state as typeof selector extends undefined ? T : S;
  };

  return { getModel, useModel, subscribe, effect };
};

export default lan;
