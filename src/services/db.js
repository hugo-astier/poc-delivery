import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'delivery',
  password: 'password',
  port: 5432,
});

(async () => {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS deliveries (
          id SERIAL PRIMARY KEY,
          description TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

  try {
    await pool.query(createTableQuery);
    console.log('Table "deliveries" ensured.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
})();

export const query = (text, params) => pool.query(text, params);

export default pool;
