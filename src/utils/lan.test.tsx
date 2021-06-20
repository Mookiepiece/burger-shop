import { mount } from 'enzyme';
import type { ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import lan from './lan';
import React from 'react';

describe('test lan', () => {
  const { getModel, useModel, subscribe, effect } = lan<{
    a: number;
    b: number;
    c?: number;
  }>({
    a: 0,
    b: 0,
  });

  const addA = effect(model => {
    return { ...model, a: model.a + 1 };
  });

  const addB = effect(model => {
    return { ...model, b: model.b + 1 };
  });

  it('create new lan', () => {
    const fn = jest.fn();
    const fnA = jest.fn();
    const fnAB = jest.fn();
    const fnB = jest.fn();

    const unsubscribe = subscribe(fn);
    const unsubscribeA = subscribe<[number]>(fnA, model => [model.a]);
    const unsubscribeAB = subscribe<[number, number]>(fnAB, model => [model.a, model.b]);
    const unsubscribeB = subscribe<[number]>(fnB, model => [model.b]);

    addA();
    expect(fn).toBeCalledTimes(1);
    expect(fnA).toBeCalledTimes(1);
    expect(fnAB).toBeCalledTimes(1);
    expect(fnB).toBeCalledTimes(0);
    expect(getModel().a).toEqual(1);
    expect(getModel().b).toEqual(0);

    fn.mockClear();
    fnA.mockClear();
    fnAB.mockClear();
    fnB.mockClear();

    addB();
    addB();
    expect(getModel().a).toEqual(1);
    expect(getModel().b).toEqual(2);
    expect(fn).toBeCalledTimes(2);
    expect(fnA).toBeCalledTimes(0);
    expect(fnAB).toBeCalledTimes(2);
    expect(fnB).toBeCalledTimes(2);

    unsubscribe();
    unsubscribeA();
    unsubscribeAB();
    unsubscribeB();
  });

  it('use with react', async () => {
    const Foo: React.FC = () => {
      const a = useModel(model => [model.a]);
      return <div>{a}</div>;
    };
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(<Foo />);
    });
    if (!wrapper!) throw new Error();

    expect(wrapper.text()).toContain('1');

    await act(async () => {
      addA();
    });
    wrapper.update();
    expect(wrapper.text()).toContain('2');
  });
});
