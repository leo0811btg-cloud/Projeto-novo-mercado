import Database from 'better-sqlite3';
try {
  const db = new Database('prices.db');
  const row = db.prepare('SELECT count(*) as count FROM markets').get();
  console.log('Database check:', row);
  process.exit(0);
} catch (err) {
  console.error('Database check failed:', err);
  process.exit(1);
}
