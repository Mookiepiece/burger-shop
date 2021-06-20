import { mount } from 'enzyme';
import type { ReactWrapper } from 'enzyme';
import React, { useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router';
import Foo from './Foo';

jest.mock('@/apis/auth');

describe('<Foo />', () => {
  beforeAll(() => {
    // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  it('haha', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <Foo />
        </MemoryRouter>
      );
    });
    if (!wrapper!) throw new Error();

    expect(typeof window).toBe('object');

    expect(wrapper.find('button')).toHaveLength(1);

    await act(async () => {
      wrapper.find('button').simulate('click');
    });

    wrapper.update();

    expect(wrapper.find('pre')).toHaveLength(1);
    expect(wrapper.find('pre').text()).toContain('12121');
  });
});
