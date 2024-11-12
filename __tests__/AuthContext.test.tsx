import React from 'react';
import {render, act, waitFor, cleanup} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthProvider,
  AuthContext,
  AuthContextType,
} from '../src/navigator/contaxt/AuthContaxt';

// Mocking AsyncStorage methods
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Clean up after each test to ensure no side effects
afterEach(() => {
  cleanup();
});

describe('AuthProvider', () => {
  it('should provide login and logout functions', async () => {
    let contextValues: AuthContextType | undefined;

    const CustomConsumer = () => {
      contextValues = React.useContext(AuthContext);
      return null;
    };

    // Render wrapped in waitFor
    await waitFor(() =>
      render(
        <AuthProvider>
          <CustomConsumer />
        </AuthProvider>,
      ),
    );

    expect(contextValues).toBeDefined();

    // Call the login function inside act()
    act(() => {
      contextValues!.login();
    });

    // Check that AsyncStorage stores the token correctly
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'userToken',
      'newUserAsyn',
    );
    expect(contextValues!.userToken).toBe('newUserAsyn');
    expect(contextValues!.isLoading).toBe(false);

    // Call the logout function inside act()
    act(() => {
      contextValues!.logout();
    });

    // Check that AsyncStorage removes the token
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userToken');
    expect(contextValues!.userToken).toBe(null);
    expect(contextValues!.isLoading).toBe(false);
  });

  it('should check if user is logged in on mount', async () => {
    // Mock AsyncStorage getItem to return a token
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('storedToken');

    let contextValues: AuthContextType | undefined;
    const CustomConsumer = () => {
      contextValues = React.useContext(AuthContext);
      return null;
    };

    // Render wrapped in waitFor
    await waitFor(() => {
      render(
        <AuthProvider>
          <CustomConsumer />
        </AuthProvider>,
      );
    });

    // Use waitFor to ensure async actions are complete before asserting
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('userToken');
      expect(contextValues!.userToken).toBe('storedToken');
      expect(contextValues!.isLoading).toBe(false);
    });
  });
});
