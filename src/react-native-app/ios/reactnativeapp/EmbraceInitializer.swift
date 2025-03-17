import Foundation
import EmbraceIO
import RNEmbraceOTLP
import EmbraceCrash

let GRAFANA_AUTH_TOKEN = "Basic GRAFANA_API_TOKEN"
let GRAFANA_TRACES_ENDPOINT = "GRAFANA_ENDPOINT/v1/traces"
let GRAFANA_LOGS_ENDPOINT = "GRAFANA_ENDPOINT/v1/logs"

@objcMembers class EmbraceInitializer: NSObject {
    // Start the EmbraceSDK with the minimum required settings, for more advanced configuration options see:
    // https://embrace.io/docs/ios/open-source/embrace-options/
    static func start() -> Void {
        do {
            // Preparing Span Exporter config with the minimum required
            let traceExporter = OtlpHttpTraceExporter(endpoint: URL(string: GRAFANA_TRACES_ENDPOINT)!,
              config: OtlpConfiguration(
                  headers: [("Authorization", GRAFANA_AUTH_TOKEN)]
              )
            )

            // Preparing Log Exporter config with the minimum required
            let logExporter = OtlpHttpLogExporter(endpoint: URL(string: GRAFANA_LOGS_ENDPOINT)!,
              config: OtlpConfiguration(
                  headers: [("Authorization", GRAFANA_AUTH_TOKEN)]
              )
            )

            let servicesBuilder = CaptureServiceBuilder()
            let urlSessionServiceOptions = URLSessionCaptureService.Options(
              injectTracingHeader: true,
              requestsDataSource: nil,
              ignoredURLs: ["grafana.net"]
            )
            // manually adding the URLSessionCaptureService
            servicesBuilder.add(.urlSession(options: urlSessionServiceOptions))
            // adding defaults
            servicesBuilder.addDefaults()

            try Embrace
                .setup(
                    options: Embrace.Options(
                        appId: "EMBRACE_IOS_APP_ID",
                        platform: .reactNative,
                        captureServices: servicesBuilder.build(),
                        crashReporter: EmbraceCrashReporter(),
                        export: OpenTelemetryExport(spanExporter: traceExporter, logExporter: logExporter) // passing the configuration into `export`
                    )
                )
                .start()
        } catch let e {
            print("Error starting Embrace \(e.localizedDescription)")
        }
    }
}
