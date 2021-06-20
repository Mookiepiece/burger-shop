import nProgress from 'nprogress';
import { useMountedState } from 'react-use';
import lan from './lan';
import { debounce } from './throttle';

const { useModel, getModel, effect, subscribe } = lan<{
  lock: number;
}>({
  lock: 0,
});

const lock = effect(model => {
  return { ...model, lock: model.lock + 1 };
});

const unlock = effect(model => {
  return { ...model, lock: model.lock - 1 };
});

const Gloading = {
  get count(): number {
    return getModel().lock;
  },
  lock,
  unlock,
};
export default Gloading;

export const useGloading = (): boolean => {
  const [v] = useModel(({ lock }) => [!!lock]);

  const isMounted = useMountedState();
  return isMounted() ? v : false;
};

subscribe(
  debounce(({ lock }) => {
    if (lock) {
      nProgress.start();
    } else {
      // should use good throttle method
      setTimeout(() => {
        if (!getModel().lock) {
          nProgress.done();
        }
      });
    }
  }, 0)
);
