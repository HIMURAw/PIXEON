import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  serverExternalPackages: ["svg-captcha"]
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-javascript/blob/master/packages/nextjs/src/config/types.ts

  // Suppresses source map uploading logs during bundling
  silent: true,
  org: "pixeon",
  project: "pixeon-shop",
}, {
  // For all available options, see:
  // https://docs.sentry.io/primitives/org-auth-token-rules/
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring-tunnel",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
