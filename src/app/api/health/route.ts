// Liveness only: used by the Docker healthcheck, so it must not depend on the database.
export function GET() {
  return Response.json({ status: "ok" });
}
