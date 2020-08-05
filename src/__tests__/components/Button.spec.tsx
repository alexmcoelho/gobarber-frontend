import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Button from '../../components/Button';

describe('Button Component', () => {
  it('should be able to render a button', async () => {
    const { getByText } = render(<Button>My Button</Button>);

    expect(getByText('My Button')).toBeTruthy();
  });

  it('should be able to render a with Loading option', async () => {
    const { getByText } = render(<Button loading>My Button</Button>);

    expect(getByText('Carregando...')).toBeTruthy();
  });
});
