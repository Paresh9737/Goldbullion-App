import React from 'react'; // React ને આયાત કરવું
import {render} from '@testing-library/react-native'; // React Native એપ્લિકેશનની ટેસ્ટિંગ માટેની લાઇબ્રેરી
import App from '../App'; // મૂળ એપ્લિકેશન ફાઈલ આયાત કરવી
import {NavigationProvider} from '../src/navigator/NavigationContext'; // નૅવિગેશન પ્રોવાઇડર આયાત કરવું
import {AuthProvider} from '../src/navigator/contaxt/AuthContaxt'; // ઓથ પ્રોવાઇડર આયાત કરવું
import AppNav from '../src/navigator/contaxt/AppNav'; // નૅવિગેશનને હેન્ડલ કરતું કંપોનેન્ટ

// NavigationContext નો mock બનાવવો
jest.mock('../src/navigator/NavigationContext', () => ({
  NavigationProvider: ({children}: {children: React.ReactNode}) => (
    <>{children}</>
  ),
}));

// AuthContext નો mock બનાવવો
jest.mock('../src/navigator/contaxt/AuthContaxt', () => ({
  AuthProvider: ({children}: {children: React.ReactNode}) => <>{children}</>,
}));

// AppNav નો mock બનાવવો
jest.mock('../src/navigator/contaxt/AppNav', () => () => (
  <div>Mocked AppNav</div>
));

// App ના તાજેતરનાં ટેસ્ટ
describe('App', () => {
  // એપ્લિકેશન ક્રેશ થયા વગર રેન્ડર થાય છે તેની તપાસ
  it('renders without crashing', () => {
    const {toJSON} = render(<App />); // એપ્લિકેશન રેન્ડર કરો
    expect(toJSON()).toBeTruthy(); // એપ્લિકેશન સાચી રીતે લોડ થાય છે તેની ખાતરી
  });

  // NavigationProvider અને AuthProvider માં AppNav રેન્ડર થાય છે તેની તપાસ
  it('renders AppNav within NavigationProvider and AuthProvider', () => {
    const {UNSAFE_getByType} = render(<App />); // Unsafe get by Type નો ઉપયોગ કરીને કંપોનેન્ટ શોધો

    // AuthProvider નમૂનાને શોધો અને ખાતરી કરો કે તે હાજર છે
    expect(UNSAFE_getByType(AuthProvider)).toBeTruthy();

    // NavigationProvider નમૂનાને શોધો અને ખાતરી કરો કે તે હાજર છે
    expect(UNSAFE_getByType(NavigationProvider)).toBeTruthy();

    // AppNav કંપોનેન્ટ ને તપાસો
    expect(UNSAFE_getByType(AppNav)).toBeTruthy();
  });
});
