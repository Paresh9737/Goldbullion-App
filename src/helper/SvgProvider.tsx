import React from 'react';
import {SvgProps} from 'react-native-svg';
import TreeLinemenu from '../assets/svg/menu-svgrepo-com.svg';
import Use from '../assets/svg/user-svgrepo-com.svg';
import LockPassword from '../assets/svg/svgviewer-output lockPassword.svg';
import Eye from '../assets/svg/eye-svgrepo-com.svg';
import CloseEye from '../assets/svg/eye-slash-svgrepo-com.svg';
import Call from '../assets/svg/call-192-svgrepo-com.svg';
import City from '../assets/svg/city-svgrepo-com.svg';
import Email from '../assets/svg/email-svgrepo-com.svg';
import GST from '../assets/svg/confirmation-number.svg';
// contactus
import Location from '../assets/svg/location-pin-svgrepo-com.svg';
import CallUS from '../assets/svg/call-19222-svgrepo-com.svg';
import EmailUS from '../assets/svg/email-1572-svgrepo-com.svg';

type SvgWrapperProps = {
  SvgComponent: React.FC<SvgProps>;
  height: number | string;
  width: number | string;
};

const SvgWrapper: React.FC<SvgWrapperProps> = ({
  SvgComponent,
  height,
  width,
}) => <SvgComponent height={height} width={width} />;

export const Svg = {
  Location: (props: Omit<SvgWrapperProps, 'SvgComponent'>) => (
    <SvgWrapper SvgComponent={Location} {...props} />
  ),
  CallUS: (props: Omit<SvgWrapperProps, 'SvgComponent'>) => (
    <SvgWrapper SvgComponent={CallUS} {...props} />
  ),
  EmailUS: (props: Omit<SvgWrapperProps, 'SvgComponent'>) => (
    <SvgWrapper SvgComponent={EmailUS} {...props} />
  ),
  // contactus

  TreeLinemenu: (props: Omit<SvgWrapperProps, 'SvgComponent'>) => (
    <SvgWrapper SvgComponent={TreeLinemenu} {...props} />
  ),
  Use: (props: Omit<SvgWrapperProps, 'SvgComponent'>) => (
    <SvgWrapper SvgComponent={Use} {...props} />
  ),
  LockPassword: (props: Omit<SvgWrapperProps, 'SvgComponent'>) => (
    <SvgWrapper SvgComponent={LockPassword} {...props} />
  ),
  Eye: (props: Omit<SvgWrapperProps, 'SvgComponent'>) => (
    <SvgWrapper SvgComponent={Eye} {...props} />
  ),
  CloseEye: (props: Omit<SvgWrapperProps, 'SvgComponent'>) => (
    <SvgWrapper SvgComponent={CloseEye} {...props} />
  ),
  Call: (props: Omit<SvgWrapperProps, 'SvgComponent'>) => (
    <SvgWrapper SvgComponent={Call} {...props} />
  ),
  City: (props: Omit<SvgWrapperProps, 'SvgComponent'>) => (
    <SvgWrapper SvgComponent={City} {...props} />
  ),
  Email: (props: Omit<SvgWrapperProps, 'SvgComponent'>) => (
    <SvgWrapper SvgComponent={Email} {...props} />
  ),
  GST: (props: Omit<SvgWrapperProps, 'SvgComponent'>) => (
    <SvgWrapper SvgComponent={GST} {...props} />
  ),
};
