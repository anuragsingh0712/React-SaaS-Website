import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Pricing } from './Pricing';

test('renders without crashing', () => {
  render(
    <MemoryRouter>
      <Pricing />
    </MemoryRouter>,
  );
});
