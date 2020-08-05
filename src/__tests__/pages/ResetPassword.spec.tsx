import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import ResetPassword from '../../pages/ResetPassword';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockedLocationSearch = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),

    useLocation: () => ({
      search: {
        replace: mockedLocationSearch,
      },
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('Reset Password page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
  });

  it('should not be able to reset password without token', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    mockedLocationSearch.mockReturnValue(null);

    const passwordField = getByPlaceholderText('Nova senha');
    const confirmPasswordField = getByPlaceholderText('Confirmação da Senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(confirmPasswordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );

      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should not be able to reset password with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const confirmPasswordField = getByPlaceholderText('Confirmação da Senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(confirmPasswordField, { target: { value: '1234567' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if reset password fails', async () => {
    const apiResponse = {
      error: {
        status: 'error',
        message: 'Api errors.',
      },
    };

    mockedLocationSearch.mockReturnValue('token-picks-up-from-the-url');

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const confirmPasswordField = getByPlaceholderText('Confirmação da Senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(confirmPasswordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      apiMock.onPost('users').reply(400, apiResponse.error);

      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );

      expect(mockedHistoryPush).not.toHaveBeenCalledWith('/');
    });
  });

  it('should be able to reset password', async () => {
    mockedLocationSearch.mockReturnValue('token-picks-up-from-the-url');

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const confirmPasswordField = getByPlaceholderText('Confirmação da Senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(confirmPasswordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      apiMock.onPost('/password/reset').reply(204, null);

      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );

      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });
});
