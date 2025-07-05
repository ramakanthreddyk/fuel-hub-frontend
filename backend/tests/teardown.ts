import { dropTestSchema, pool } from './utils/db-utils';

export default async function () {
  try {
    await dropTestSchema();
  } catch (_) {}
  await pool.end().catch(() => {});
}
