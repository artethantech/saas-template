import { expect, it } from "vitest";
import { GET } from "./route";

it("reports liveness without touching external services", async () => {
  const response = GET();
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: "ok" });
});
