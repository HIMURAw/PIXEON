export async function GET() {
  // Trigger an intentional error to verify Sentry setup
  throw new Error("Sentry Test Error: Monitoring/Logging System integration test successful!");
}
