import React from 'react';
import { render } from '@testing-library/react';
import ToastContainer from '../../components/ToastContainer';
import { ToastMessage } from '../../hooks/toast';

describe('ToastContainer Component', () => {
  it('should be able to render a toast message', async () => {
    const messages: ToastMessage[] = [
      {
        id: 'toast-id',
        title: 'Info Toast',
        description: 'Test of AddToast with Info',
      },
    ];

    const { getByTestId } = render(<ToastContainer messages={messages} />);

    expect(getByTestId('toast-container')).toBeTruthy();
  });
});
