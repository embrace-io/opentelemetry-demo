// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import DeviceInfo from 'react-native-device-info'
import {Platform} from 'react-native';

interface IRequestParams {
  url: string;
  body?: object;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  queryParams?: Record<string, any>;
  headers?: Record<string, string>;
}

const request = async <T>({
  url = '',
  method = 'GET',
  body,
  queryParams = {},
  headers = {
    'content-type': 'application/json',
  },
}: IRequestParams): Promise<T> => {
  // The Android emulator has a special lookback for localhost
  const isEmulator = await DeviceInfo.isEmulator();
  const API_URL = Platform.OS === "android" && isEmulator  ?
    "http://10.0.2.2:8080"
    : "http://127.0.0.1:8080"

  const requestURL = `${API_URL}${url}?${new URLSearchParams(queryParams).toString()}`;
  const requestBody = body ? JSON.stringify(body) : undefined;
  const response = await fetch(requestURL, {
    method,
    body: requestBody,
    headers,
  });

  const responseText = await response.text();

  if (!!responseText) return JSON.parse(responseText);

  return undefined as unknown as T;

};

export default request;
