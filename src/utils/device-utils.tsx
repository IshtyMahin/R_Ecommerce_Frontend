import React from 'react';
import { Smartphone, Laptop, Tablet, Monitor, PcCase } from 'lucide-react';

// Define DeviceType enum with PC added
export enum DeviceType {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
  PC = 'pc',
  UNKNOWN = 'unknown',
}

// Function to get Lucide icon based on device type
export const getDeviceIcon = (device: DeviceType | string) => {
  switch (device) {
    case DeviceType.MOBILE:
      return <Smartphone className="w-5 h-5 text-gray-600" />;
    case DeviceType.TABLET:
      return <Tablet className="w-5 h-5 text-gray-600" />;
    case DeviceType.DESKTOP:
      return <Laptop className="w-5 h-5 text-gray-600" />;
    case DeviceType.PC:
      return <PcCase className="w-5 h-5 text-gray-600" />;
    default:
      return <Monitor className="w-5 h-5 text-gray-600" />;
  }
};
