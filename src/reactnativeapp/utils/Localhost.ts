import DeviceInfo from 'react-native-device-info'
import {Platform} from 'react-native';

const getLocalhost = async (): Promise<string> => {
  const isEmulator = await DeviceInfo.isEmulator();

  // The Android emulator has a special lookback for localhost
  return Platform.OS === "android" && isEmulator  ?
    "10.0.2.2" : "localhost";
};

export default getLocalhost;
