import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('should display the text', () => {
    expect(screen.getByText('The App Component')).toBeTruthy();
  });
});
