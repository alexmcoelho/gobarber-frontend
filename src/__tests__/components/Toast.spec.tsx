import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';

import Toast from '../../components/ToastContainer/Toast';
import { ToastMessage } from '../../hooks/toast';

const style = {
  from: { right: '-120%', opacity: 0 },
  enter: { right: '0%', opacity: 1 },
  leave: { right: '-120%', opacity: 0 },
};

const mockedRemoveToast = jest.fn();

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      removeToast: mockedRemoveToast,
    }),
  };
});

const message: ToastMessage = {
  id: 'toast-id',
  title: 'Info Toast',
  description: 'Test of AddToast with Info',
};

jest.useFakeTimers();

describe('Toast Component', () => {
  it('should be able to render a toast component', async () => {
    act(() => {
      mockedRemoveToast.mockImplementation(() => {
        return true;
      });
    });

    const { getByTestId } = render(<Toast message={message} style={style} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByTestId('toast-card')).toBeTruthy();
  });

  it('should be able to render to remove a toast by timeout', async () => {
    act(() => {
      mockedRemoveToast.mockImplementation(() => {
        return true;
      });
    });

    const { getByTestId } = render(<Toast message={message} style={style} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByTestId('toast-card')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    act(() => {
      expect(mockedRemoveToast).toHaveBeenCalledWith(message.id);
    });

    act(() => {
      expect(mockedRemoveToast).toHaveBeenCalledTimes(1);
    });
  });

  it('should be able to render a Toast component', async () => {
    act(() => {
      mockedRemoveToast.mockImplementation(() => {
        return true;
      });
    });

    const { getByTestId } = render(<Toast message={message} style={style} />);

    const closeButton = getByTestId('toast-close-button');

    act(() => {
      fireEvent.click(closeButton);
    });

    act(() => {
      expect(mockedRemoveToast).toHaveBeenCalledWith(message.id);
    });

    act(() => {
      expect(mockedRemoveToast).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  // it('should be able to remove a Toast component by useEffect Hook', async () => {
  //   const message: ToastMessage = {
  //     id: 'toast-id',
  //     title: 'Info Toast',
  //     description: 'Test of AddToast with Info',
  //   };

  //   mockedRemoveToast.mockImplementation(() => {
  //     return true;
  //   });

  //   const { getByTestId } = render(<Toast message={message} style={style} />);

  //   const toastCard = getByTestId('toast-card');

  //   // jest.setTimeout(7000);

  //   // waitForElementToBeRemoved(toastCard, { timeout: 7000 }).then(() =>
  //   //   expect(toastCard).not.toBeInTheDocument(),
  //   // );

  //   // jest.advanceTimersByTime(1000);
  //   // jest.runOnlyPendingTimers();

  //   // jest.useRealTimers();

  //   expect(mockedRemoveToast).toHaveBeenCalledWith(message.id);
  //   // await waitForElementToBeRemoved(() => toastCard).then(() =>
  //   //   expect(toastCard).not.toBeInTheDocument(),
  //   // );

  //   // expect(toastCard).not.toBeInTheDocument();

  //   // jest.setTimeout(5000);

  //   // await expect(
  //   //   waitForElementToBeRemoved(async () => getByTestId('toast-card'), {
  //   //     timeout: 7000,
  //   //   }),
  //   // ).rejects.toThrowError(
  //   //   /Timed out/i,
  //   //   // 'Timed out in waitForElementToBeRemoved.',
  //   // );

  //   // waitForElementToBeRemoved(getByTestId('toast-card')).then(() =>
  //   //   expect(getByTestId('toast-card')).not.toBeInTheDocument(),
  //   // );

  //   // await waitForElementToBeRemoved(async () => getByTestId('toast-card'), {
  //   //   timeout: 6000,
  //   //   onTimeout: error => {
  //   //     console.log('deu erro');
  //   //   },
  //   // });

  //   // // await expect(getByTestId('toast-card')).not.toBeTruthy();
  //   // await expect(getByTestId('toast-card')).rejects.toThrowError(
  //   //   'Unable to find an element by: [data-testid="toast-card"]',
  //   // );
  // });
});
