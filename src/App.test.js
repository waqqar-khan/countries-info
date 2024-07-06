import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Countries Info header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Countries Info/i);
  expect(headerElement).toBeInTheDocument();
});
