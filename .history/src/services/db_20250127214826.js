import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'delivery_db',
  password: 'yourpassword',
  port: 5432,
});

export const query = (text, params) => pool.query(text, params);

export default pool;
