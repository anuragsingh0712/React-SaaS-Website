import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Resources } from './Resources';

test('renders without crashing', () => {
  render(
    <MemoryRouter>
      <Resources />
    </MemoryRouter>,
  );
});
