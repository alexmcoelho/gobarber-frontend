import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import Profile from '../../pages/Profile';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockUser = {
  id: 'user123',
  name: 'John Doe',
  email: 'johndoe@example.com.br',
  avatar: 'image-avatar.jpg',
  avatar_url: 'image-avatar.jpg',
};

const mockedHistoryPush = jest.fn();
const mockedUpdateUser = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),

    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      updateUser: mockedUpdateUser,
      user: mockUser,
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

describe('Profile page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to load the Profile page with logged user data', async () => {
    apiMock.onPut('/profile', mockUser).reply(200, mockUser);

    const { getByPlaceholderText, getByRole } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const avatarImage = getByRole('img', { name: /John Doe/i });

    waitFor(() => {
      expect(nameField).toHaveAttribute('value', 'Jonh Doe');
      expect(emailField).toHaveAttribute('value', 'johndoe@example.com.br');
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage).toHaveAttribute('alt', 'Jonh Doe');
    });
  });

  it('should display an error if register nome input is empty', async () => {
    // const apiResponse = {
    //   error: {
    //     status: 'error',
    //     message: 'Email address already used.',
    //   },
    // };

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    // const emailField = getByPlaceholderText('E-mail');
    // const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Confirmar mudanças');

    fireEvent.change(nameField, { target: { value: '' } });
    // fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    // fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      // apiMock.onPut('/profile', mockUser).reply(200, mockUser);
      // expect(mockedAddToast).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     type: 'error',
      //   }),
      // );
      // expect(mockedHistoryPush).not.toHaveBeenCalledWith('/');
    });
  });

  it('should display an error if password is different of the password confirmation', async () => {
    // const apiResponse = {
    //   error: {
    //     status: 'error',
    //     message: 'Email address already used.',
    //   },
    // };

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const oldPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirmar senha');
    const buttonElement = getByText('Confirmar mudanças');

    fireEvent.change(oldPasswordField, { target: { value: 'old-password' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '1234567' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should be able to change or profile data', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'John Doe 2',
        email: 'johndoe2@example.com.br',
        avatar: 'image-avatar.jpg',
        avatar_url: 'image-avatar.jpg',
      },
    };

    apiMock.onPut('/profile', mockUser).reply(200, apiResponse);

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const oldPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirmar senha');
    const buttonElement = getByText('Confirmar mudanças');

    fireEvent.change(nameField, { target: { value: 'John Doe 2' } });
    fireEvent.change(emailField, {
      target: { value: 'johndoe2@example.com.br' },
    });
    fireEvent.change(oldPasswordField, { target: { value: 'old-password' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonElement);

    waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  //   // it('should not be able to sign in with invalid credentials', async () => {
  //   //   const { getByPlaceholderText, getByText } = render(<Profile />);

  //   //   const nameField = getByPlaceholderText('Nome');
  //   //   const emailField = getByPlaceholderText('E-mail');
  //   //   const passwordField = getByPlaceholderText('Senha');
  //   //   const buttonElement = getByText('Cadastrar');

  //   //   fireEvent.change(nameField, { target: { value: '' } });
  //   //   fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
  //   //   fireEvent.change(passwordField, { target: { value: '123456' } });

  //   //   fireEvent.click(buttonElement);

  //   //   await waitFor(() => {
  //   //     expect(mockedHistoryPush).not.toHaveBeenCalled();
  //   //   });
  //   // });
});
