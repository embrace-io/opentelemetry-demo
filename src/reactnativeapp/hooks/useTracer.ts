import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor, SimpleSpanProcessor, ConsoleSpanExporter} from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_DEVICE_ID,
  SEMRESATTRS_OS_NAME,
  SEMRESATTRS_OS_VERSION,
  SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import getLocalhost from '@/utils/Localhost';
import { useEffect, useState } from 'react';
import { getDeviceId, getSystemVersion, getVersion } from 'react-native-device-info';
import { Platform } from 'react-native';

const Tracer = async () => {
  const resource = new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "reactnativeapp",
    [SEMRESATTRS_OS_NAME]: Platform.OS,
    [SEMRESATTRS_OS_VERSION]: getSystemVersion(),
    [SEMRESATTRS_SERVICE_VERSION]: getVersion(),
    [SEMRESATTRS_DEVICE_ID]: getDeviceId(),
  });
  const provider = new WebTracerProvider({ resource });

  const localhost = await getLocalhost();
  provider.addSpanProcessor(
    new BatchSpanProcessor(
      new OTLPTraceExporter({
        url: `http://${localhost}:8080/otlp-http/v1/traces`,
      }),
      {
        scheduledDelayMillis: 500,
      }
    )
  );

  // Helpful for debugging
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

  provider.register({
    propagator: new CompositePropagator({
      propagators: [new W3CBaggagePropagator(), new W3CTraceContextPropagator()],
    }),
  });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-user-interaction': { enabled: false },
        '@opentelemetry/instrumentation-document-load': { enabled: false },
        '@opentelemetry/instrumentation-fetch': {
          propagateTraceHeaderCorsUrls: /.*/,
          clearTimingResources: false,
        },
      }),
    ],
  });
};

export interface TracerResult {
  loaded: boolean;
}

export const useTracer = () : TracerResult => {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
     if (!loaded) {
      Tracer()
        .catch(() => console.warn("failed to setup tracer"))
        .finally(() => setLoaded(true))
    }
  }, [loaded]);

  return {
    loaded
  }
}