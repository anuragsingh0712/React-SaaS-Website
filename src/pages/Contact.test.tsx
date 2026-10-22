import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Contact } from './Contact';

test('renders without crashing', () => {
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>,
  );
});
