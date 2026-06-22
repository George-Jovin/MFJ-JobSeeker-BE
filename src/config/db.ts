import { Pool } from 'pg';
import type { QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/myj_jobseeker';

export const pool = new Pool({
  connectionString: databaseUrl,
});

pool.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Database connection pool error:', err);
});

export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};
