import { useCallback, useRef, useState } from 'react';
import { useEventCallback } from 'starfall/lib/_utils/useEventCallback';
import { FunctionReturningPromise, PromiseType } from 'react-use/lib/misc/types';
import { AsyncState } from 'react-use/lib/useAsyncFn';
import { useMountedState } from 'react-use';

type StateFromFunctionReturningPromise<T extends FunctionReturningPromise> = AsyncState<PromiseType<ReturnType<T>>>;

export const __USE_REQUEST_CACHE__: Record<string, any> = {};

const useRequest = <T extends FunctionReturningPromise>(
  fn: T,
  options?: { initialState?: AsyncState<PromiseType<ReturnType<T>>> }
): [StateFromFunctionReturningPromise<T>, (...args: Parameters<T>) => Promise<ReturnType<T>>, () => void] => {
  const isMounted = useMountedState();

  const [state, setState] = useState<StateFromFunctionReturningPromise<T>>(options?.initialState || { loading: false });

  const lock = useRef<Promise<ReturnType<T>> | null>(null);

  const lastCallId = useRef(0);

  const nextArgs = useRef<[T, Parameters<T>] | null>(null);

  const iTrigger = useCallback(
    (fn: T, args: Parameters<T>): Promise<ReturnType<T>> => {
      setState(prevState => ({ ...prevState, loading: true }));
      const id = ++lastCallId.current;
      return (lock.current = fn(...args)
        .then(value => {
          if (isMounted()) {
            if (id === lastCallId.current) {
              setState({ value, loading: false });
            }
          }
          return value;
        })
        .catch(error => {
          if (isMounted()) {
            if (id === lastCallId.current) {
              setState({ error, loading: false });
            }
          }
          throw error;
        })).finally(() => {
        lock.current = null;
      });
    },
    [isMounted]
  );

  const mTrigger = useEventCallback((): void => {
    console.log(!!lock.current, nextArgs.current);
    if (!lock.current && nextArgs.current) {
      const [fn, args] = nextArgs.current;
      nextArgs.current = null;
      iTrigger(fn, args).finally(mTrigger);
    }
  });

  const trigger = useEventCallback((...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (!lock.current) {
      return iTrigger(fn, args).finally(mTrigger);
    } else {
      nextArgs.current = [fn, args];
      return lock.current;
    }
  });

  const cancelAndClean = useEventCallback(() => {
    lastCallId.current++;
    setState(prevState => ({ ...prevState, value: undefined }));
  });

  return [state, trigger, cancelAndClean];
};

export default useRequest;

// const trigger = useEventCallback((...args: Parameters<T>): void => {
//   if (lock.current) {
//     nextArgs.current = [fn, args];
//   } else {
//     setState(prevState => ({ ...prevState, loading: (lock.current = true) }));

//     const _fn = nextArgs.current?.[0] || fn;
//     nextArgs.current = null;

//     const id = ++lastCallId.current;
//     _fn(...args)
//       .then(value => {
//         if (isMounted()) {
//           if (id === lastCallId.current) {
//             setState({ value, loading: (lock.current = false) });
//           }
//         }
//       })
//       .catch(error => {
//         if (isMounted()) {
//           if (id === lastCallId.current) {
//             setState({ error, loading: (lock.current = false) });
//           }
//         }
//       })
//       .finally(() => {
//         if (nextArgs.current) {
//           trigger(...nextArgs.current[1]);
//         }
//       });
//   }
// });
