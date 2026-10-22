import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Features } from './Features';

test('renders without crashing', () => {
  render(
    <MemoryRouter>
      <Features />
    </MemoryRouter>,
  );
});
