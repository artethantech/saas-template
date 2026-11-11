// Connects to the configured PostgreSQL and runs a trivial query. Never prints the connection string.
import nextEnv from "@next/env";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());
const connectionString =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) {
  process.stderr.write("DATABASE_URL is not set (see .env.example).\n");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  connectionTimeoutMillis: 5_000,
});
try {
  await client.connect();
  const { rows } = await client.query("select version() as version");
  process.stdout.write(`PostgreSQL connection ok: ${rows[0].version}\n`);
} catch (error) {
  process.stderr.write(
    `PostgreSQL connection failed: ${error.code ?? error.message}\n`,
  );
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
