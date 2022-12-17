import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const {container} = render(<App />);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const sidebar = container.querySelector('.App_Sidebar')
  expect(sidebar).toBeInTheDocument();
});
