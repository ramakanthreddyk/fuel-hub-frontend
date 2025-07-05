import { createTestSchema } from './utils/db-utils';

export default async function () {
  try {
    await createTestSchema();
  } catch (_) {}
}
