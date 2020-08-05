import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import Dashboard from '../../pages/Dashboard';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedSignOut = jest.fn();

const mockUser = {
  id: 'user123',
  name: 'John Doe',
  email: 'johndoe@example.com.br',
  avatar_url: 'null',
};

const dateNow = '2020-08-03T16:00:00.000Z';

const mockAppointments = [
  {
    id: 'appointment-1',
    provider_id: 'user123',
    user_id: 'user-id-1',
    date: dateNow,
    user: {
      id: 'user-id-1',
      name: 'Usuário 1',
      avatar_url: 'image-user-1.jpg',
    },
  },
  {
    id: 'appointment-2',
    provider_id: 'user123',
    user_id: 'user-id-2',
    date: dateNow,
    user: {
      id: 'user-id-2',
      name: 'Usuário 2',
      avatar_url: 'image-user-2.jpg',
    },
  },
];

const mockMonthAvailability = new Array(31)
  .fill(null)
  .map((_, index) => ({ day: index + 1, available: true }));

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signOut: mockedSignOut,
      user: mockUser,
    }),
  };
});

describe('Dashboard Page', () => {
  it('should be able to show the dashboard Page', async () => {
    apiMock
      .onGet('/providers/user123/month-availability')
      .reply(200, mockMonthAvailability);

    apiMock.onGet('/appointments/me').reply(200, mockAppointments);

    const { getByPlaceholderText, getByText } = render(<Dashboard />);

    const nameElement = getByText('John Doe');

    waitFor(() => {
      expect(nameElement).toBeInTheDocument();
    });
  });
});
