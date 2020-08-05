import * as React from 'react';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { useToast, ToastProvider } from '../../hooks/toast';

// jest.mock('react', () => ({
//   ...jest.requireActual('react'),
//   useState: jest.fn(),
// }));

afterEach(cleanup);

describe('Toast hook', () => {
  it('Should be able to test useState to set a message on state by addToast', async () => {
    const toast = {
      title: 'Info Toast',
      description: 'Test of AddToast with Info',
    };

    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.addToast(toast);
    });
  });

  it('Should be able to test setMessages to set all messages excpet the message with the id', async () => {
    const toast = {
      title: 'Info Toast',
      description: 'Test of AddToast with Info',
    };

    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.addToast(toast);
      result.current.removeToast('toast-id');
    });
  });

  jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
  }));

  const setState = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useStateMock: any = (initState: any) => [initState, setState];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be able to add a Toast with type like info', async () => {
    const toast = {
      title: 'Info Toast',
      description: 'Test of AddToast with Info',
    };

    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.addToast(toast);
    });

    expect(setState).toHaveBeenCalledTimes(1);
  });

  it('Should be able to remove a Toast with type like info', async () => {
    const toast = {
      title: 'Info Toast',
      description: 'Test of AddToast with Info',
    };

    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.addToast(toast);
      result.current.removeToast('some-id');
    });

    expect(setState).toHaveBeenCalledTimes(2);
  });
});
