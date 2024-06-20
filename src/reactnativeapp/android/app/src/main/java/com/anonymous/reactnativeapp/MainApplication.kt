package com.anonymous.reactnativeapp

import android.app.Application
import android.content.res.Configuration
import android.os.Build

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.ReactHost
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import io.opentelemetry.android.OpenTelemetryRum
import io.opentelemetry.android.OpenTelemetryRumBuilder
import io.opentelemetry.android.config.OtelRumConfig

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper
import io.opentelemetry.exporter.logging.LoggingSpanExporter;
import io.opentelemetry.sdk.resources.Resource
import okhttp3.OkHttpClient
import okhttp3.Request


class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
        this,
        object : DefaultReactNativeHost(this) {
          override fun getPackages(): List<ReactPackage> {
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(new MyReactNativePackage());
            return PackageList(this).packages
          }

          override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

          override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

          override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
          override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }
  )

  override val reactHost: ReactHost
    get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }

    val traceURL = when(Build.FINGERPRINT.contains("generic")) {
      // The Android emulator has a special loopback for localhost
      true -> "http://10.0.2.2:8080/otlp-http/v1/traces"

        // TODO check for emulator isn't working
      false -> "http://10.0.2.2:8080/otlp-http/v1/traces"
    }

    // TODO defer to the resource created by the otel builder, application name isn't being grabbed correctly
    val resource: Resource =
      Resource.getDefault().toBuilder().put("service.name", "androidtest").build()


    val config = OtelRumConfig()
    val otelRumBuilder: OpenTelemetryRumBuilder =
        OpenTelemetryRum.builder(this, config)
            .addSpanExporterCustomizer {
                LoggingSpanExporter.create()
            }
            /*
            .addSpanExporterCustomizer {
                OtlpHttpSpanExporter.builder()
                    .setEndpoint(traceURL)
                    .build()
            }

             */
    val rum = otelRumBuilder.build()

    val tracer = rum.openTelemetry.getTracer("test")
    tracer.spanBuilder("my-span-6").startSpan().end();


    val client = OkHttpClient()

    val request = Request.Builder()
      .url("https://example.com/api")
      .build()

    client.newCall(request).execute()

    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}
