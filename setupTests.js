import Enzyme from 'enzyme';
import Adapter from '@testing-library/jest-native/extend-expect';

Enzyme.configure({adapter: new Adapter()});
