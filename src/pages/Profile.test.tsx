import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Profile } from './Profile';

test('renders without crashing', () => {
  render(
    <MemoryRouter>
      <ThemeProvider>
        <Profile />
      </ThemeProvider>
    </MemoryRouter>,
  );
});
