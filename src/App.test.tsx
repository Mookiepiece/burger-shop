import App from './App';
import React from 'react';
import { mount, shallow } from 'enzyme';
import { Button } from 'antd';
import { MemoryRouter } from 'react-router';
import { act } from 'react-dom/test-utils';

describe('<App />', () => {
  test('renders without exploding', async () => {
    await act(async () => {
      const wrapper = mount(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
    });
  });
});
