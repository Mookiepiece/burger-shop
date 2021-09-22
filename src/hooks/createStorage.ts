// import useRequest from './useRequest';

import { useEffect, useMemo } from 'react';
import { useGetSet } from 'react-use';

type StorageModel<T extends STORAGE_VALUE> = {
  get(): T;
  set(t: T): void;
};

const createStorage = <T extends STORAGE_VALUE>({
  root,
  initialValue,
  version,
  upgrader,
}: {
  root: string;
  initialValue: Omit<T, 'meta'>;
  version: number;
  upgrader: Upgrader;
}): StorageModel<T> => {
  let _obj: any;
  try {
    _obj = JSON.parse(sessionStorage.getItem(root) || 'throws an error');

    if (_obj) {
      let error = null;
      const fallback = () => (error = true);

      if (typeof _obj.meta.version !== 'number') throw new Error();

      const filteredUpgrader = Object.entries(upgrader({ fallback }))
        .filter(([ver]) => Number(ver) < version)
        .filter(([ver]) => Number(ver) > _obj.meta.version);

      for (const key in filteredUpgrader) {
        _obj = filteredUpgrader[key][1](_obj);
        if (error) {
          throw new Error();
        }
      }
    }
  } catch (e) {
    _obj = initialValue;
  }
  let obj: T = _obj;

  obj.meta = { ...obj.meta, version };
  sessionStorage.setItem(root, JSON.stringify(obj));
  return {
    get() {
      return obj;
    },
    set(t: T) {
      obj = t;
      sessionStorage.setItem(root, JSON.stringify(t));
    },
  };
};

type STORAGE_VALUE = {
  meta: {
    version: number;
  };
};

type WEB_SESSION_STORAGE = STORAGE_VALUE & {
  a: number;
};

// 11 -> 14

type Upgrader = (param: { fallback: () => void }) => Record<string, (legacyValue: any) => any | void>;

const upgrader: Upgrader = ({ fallback }) => ({
  '9': () => {
    fallback();
  },
  '11': () => {},
  '12': () => {},
  '14': () => {},
});

const webSessionStorage = createStorage<WEB_SESSION_STORAGE>({
  root: 'thimble_web',
  initialValue: { a: 0 },
  version: 14,
  upgrader,
});

const useStorage = <T extends STORAGE_VALUE>(
  storageModel: StorageModel<T>
): [T, React.Dispatch<React.SetStateAction<T>>, () => T] => {
  const [get, set] = useGetSet(storageModel.get());
  const v = get();
  useEffect(() => {
    storageModel.set(v);
  }, [storageModel, v]);

  return useMemo(() => [get(), set, get], [get, set]);
};

// ---
// const useA = () => {
//   const [webSessionModel, setWebSessionModel] = useStorage(webSessionStorage);
//   const [trigger, { loading, value, error }] = useRequest(apiQuote);

//   trigger().then((a: number) => setWebSessionModel(v => ({ ...v, a })));
// };

// ...(quote)
