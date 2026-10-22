import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ResourceDetail } from './ResourceDetail';

test('renders without crashing', () => {
  render(
    <MemoryRouter initialEntries={['/resources/r1']}>
      <Routes>
        <Route path="/resources/:id" element={<ResourceDetail />} />
      </Routes>
    </MemoryRouter>,
  );
});
