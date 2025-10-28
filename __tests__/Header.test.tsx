import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header', () => {
  it('renders the FixEasy logo', () => {
    render(<Header />);
    expect(screen.getByText(/FixEasy/i)).toBeInTheDocument();
  });
});
