import { Pool, PoolClient } from 'pg';
import { randomUUID } from 'crypto';
import { CreditorInput, CreditPaymentInput, PaymentQuery } from '../validators/creditor.validator';
import { isDateFinalized } from './reconciliation.service';
import { parseRows, parseRow } from '../utils/parseDb';

export async function createCreditor(db: Pool, tenantId: string, input: CreditorInput): Promise<string> {
  const res = await db.query<{ id: string }>(
    `INSERT INTO public.creditors (id, tenant_id, party_name, contact_number, address, credit_limit, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING id`,
    [randomUUID(), tenantId, input.partyName, input.contactNumber || null, input.address || null, input.creditLimit || 0]
  );
  return res.rows[0].id;
}

export async function listCreditors(db: Pool, tenantId: string) {
  const res = await db.query(
    'SELECT id, party_name, contact_number, address, credit_limit, status, created_at FROM public.creditors WHERE tenant_id = $1 ORDER BY party_name',
    [tenantId]
  );
  return parseRows(res.rows);
}

export async function updateCreditor(db: Pool, tenantId: string, id: string, input: CreditorInput) {
  await db.query(
    `UPDATE public.creditors SET
      party_name = COALESCE($2, party_name),
      contact_number = COALESCE($3, contact_number),
      address = COALESCE($4, address),
      credit_limit = COALESCE($5, credit_limit)
     WHERE id = $1 AND tenant_id = $6`,
    [id, input.partyName || null, input.contactNumber || null, input.address || null, input.creditLimit, tenantId]
  );
}

export async function markCreditorInactive(db: Pool, tenantId: string, id: string) {
  await db.query('UPDATE public.creditors SET status = $3 WHERE id = $1 AND tenant_id = $2', [id, tenantId, 'inactive']);
}

export async function getCreditorById(db: Pool | PoolClient, tenantId: string, id: string) {
  const res = await db.query<{ id: string; credit_limit: number; balance: number }>(
    'SELECT id, credit_limit, balance FROM public.creditors WHERE id = $1 AND tenant_id = $2',
    [id, tenantId]
  );
  return parseRow(res.rows[0]);
}

export async function incrementCreditorBalance(db: Pool | PoolClient, tenantId: string, id: string, amount: number) {
  await db.query('UPDATE public.creditors SET balance = balance + $3 WHERE id = $1 AND tenant_id = $2', [id, tenantId, amount]);
}

export async function decrementCreditorBalance(db: Pool | PoolClient, tenantId: string, id: string, amount: number) {
  await db.query('UPDATE public.creditors SET balance = balance - $3 WHERE id = $1 AND tenant_id = $2', [id, tenantId, amount]);
}

export async function createCreditPayment(
  db: Pool,
  tenantId: string,
  input: CreditPaymentInput,
  userId: string
): Promise<string> {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const today = new Date();
    const finalized = await isDateFinalized(client, tenantId, new Date(today.toISOString().slice(0, 10)));
    if (finalized) {
      throw new Error('Day already finalized');
    }
    const creditor = await getCreditorById(client, tenantId, input.creditorId);
    if (!creditor) {
      throw new Error('Invalid creditor');
    }
    const res = await client.query<{ id: string }>(
      `INSERT INTO public.credit_payments (id, tenant_id, creditor_id, amount, payment_method, reference_number, received_by, received_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW()) RETURNING id`,
      [randomUUID(), tenantId, input.creditorId, input.amount, input.paymentMethod, input.referenceNumber || null, userId]
    );
    await decrementCreditorBalance(client, tenantId, input.creditorId, input.amount);
    await client.query('COMMIT');
    return res.rows[0].id;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function listCreditPayments(db: Pool, tenantId: string, query: PaymentQuery) {
  const params: any[] = [];
  let idx = 1;
  const conds: string[] = [];
  if (query.creditorId) {
    conds.push(`creditor_id = $${idx++}`);
    params.push(query.creditorId);
  }
  const where = conds.length ? `WHERE ${conds.join(' AND ')} AND tenant_id = $${idx}` : `WHERE tenant_id = $${idx}`;
  params.push(tenantId);
  const res = await db.query(
    `SELECT id, creditor_id, amount, payment_method, reference_number, received_at, created_at
     FROM public.credit_payments ${where}
     ORDER BY received_at DESC`,
    params
  );
  return parseRows(res.rows);
}
