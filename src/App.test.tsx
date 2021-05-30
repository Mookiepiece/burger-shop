import App from './App';
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { act } from 'react-dom/test-utils';

describe('<App />', () => {
  test('renders without exploding', async () => {
    await act(async () => {
      mount(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
    });
  });
});
