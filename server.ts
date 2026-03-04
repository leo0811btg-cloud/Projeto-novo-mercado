import express from 'express';
// import { createServer as createViteServer } from 'vite'; // Moved to dynamic import
import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database setup: Use Turso (SQLite in the cloud) if configured, otherwise fallback to local SQLite
const useTurso = process.env.TURSO_URL && process.env.TURSO_AUTH_TOKEN;
let db: any;

if (useTurso) {
  console.log('Using Turso (SQLite in the cloud) for persistence');
  db = createClient({
    url: process.env.TURSO_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
} else {
  console.log('Using local SQLite (prices.db)');
  const localDb = new Database('prices.db');
  
  // Wrapper to make better-sqlite3 match @libsql/client interface for basic queries
  db = {
    execute: async (sql: string, args: any[] = []) => {
      const stmt = localDb.prepare(sql);
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const rows = stmt.all(...args);
        return { rows };
      } else {
        const result = stmt.run(...args);
        return { lastInsertRowid: result.lastInsertRowid };
      }
    },
    // For better-sqlite3 specific calls used in the app
    prepare: (sql: string) => localDb.prepare(sql),
    exec: (sql: string) => localDb.exec(sql)
  };
}

// Database Initialization Helper
async function initDb() {
  const schema = `
    CREATE TABLE IF NOT EXISTS markets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE,
      password TEXT,
      logo TEXT,
      cover_image TEXT,
      address TEXT,
      phone TEXT,
      hours TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT,
      category TEXT,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      market_id INTEGER,
      product_id INTEGER,
      price REAL NOT NULL,
      valid_until TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(market_id) REFERENCES markets(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS tabloides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      market_id INTEGER,
      title TEXT,
      pdf_url TEXT NOT NULL,
      valid_until TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(market_id) REFERENCES markets(id)
    );
  `;

  if (useTurso) {
    // Turso uses multiple calls or a batch for schema
    const statements = schema.split(';').filter(s => s.trim());
    for (const s of statements) {
      await db.execute(s);
    }
  } else {
    db.exec(schema);
  }

  // Seed data if empty
  let marketCountResult;
  if (useTurso) {
    marketCountResult = await db.execute('SELECT count(*) as count FROM markets');
  } else {
    marketCountResult = { rows: [db.prepare('SELECT count(*) as count FROM markets').get()] };
  }
  
  const count = (marketCountResult.rows[0] as any).count;
  
  if (count === 0) {
    console.log('Seeding database...');
    const markets = [
      ['Abevê Supermercados', 'abeve', 'ADM', '', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1000&auto=format&fit=crop', 'Av. Marcelino Pires, 1234', '(67) 3411-0000', '08:00 - 22:00'],
      ['Supermercado Chama', 'chama', 'ADM', '', 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=1000&auto=format&fit=crop', 'Rua Cuiabá, 567', '(67) 3422-0000', '07:30 - 21:00'],
      ['Líder Supermercados', 'lider', 'ADM', '', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop', 'Rua Hayel Bon Faker, 890', '(67) 3433-0000', '08:00 - 20:00']
    ];

    const products = [
      ['Arroz Branco 5kg', 'Tio João', 'Alimentos', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop'],
      ['Óleo de Soja 900ml', 'Liza', 'Alimentos', 'https://plus.unsplash.com/premium_photo-1667546202655-7f123068d122?q=80&w=800&auto=format&fit=crop'],
      ['Feijão Carioca 1kg', 'Camil', 'Alimentos', 'https://images.unsplash.com/photo-1551462147-37885acc36f1?q=80&w=800&auto=format&fit=crop'],
      ['Leite Integral 1L', 'Ninho', 'Bebidas', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=800&auto=format&fit=crop'],
      ['Café em Pó 500g', 'Pilão', 'Bebidas', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop'],
      ['Detergente Líquido 500ml', 'Ypê', 'Limpeza', 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?q=80&w=800&auto=format&fit=crop']
    ];

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const validUntil = nextWeek.toISOString().split('T')[0];

    if (useTurso) {
      const marketIds: any[] = [];
      for (const m of markets) {
        const res = await db.execute({
          sql: 'INSERT INTO markets (name, username, password, logo, cover_image, address, phone, hours) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          args: m
        });
        marketIds.push(res.lastInsertRowid);
      }

      const productIds: any[] = [];
      for (const p of products) {
        const res = await db.execute({
          sql: 'INSERT INTO products (name, brand, category, image_url) VALUES (?, ?, ?, ?)',
          args: p
        });
        productIds.push(res.lastInsertRowid);
      }

      for (const mId of marketIds) {
        for (const pId of productIds) {
          const price = (Math.random() * 25 + 5).toFixed(2);
          await db.execute({
            sql: 'INSERT INTO offers (market_id, product_id, price, valid_until) VALUES (?, ?, ?, ?)',
            args: [mId, pId, price, validUntil]
          });
        }
      }

      for (let i = 0; i < marketIds.length; i++) {
        await db.execute({
          sql: 'INSERT INTO tabloides (market_id, title, pdf_url, valid_until) VALUES (?, ?, ?, ?)',
          args: [marketIds[i], `Ofertas de Março - ${markets[i][0]}`, 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', validUntil]
        });
      }
    } else {
      const insertMarket = db.prepare('INSERT INTO markets (name, username, password, logo, cover_image, address, phone, hours) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      const insertProduct = db.prepare('INSERT INTO products (name, brand, category, image_url) VALUES (?, ?, ?, ?)');
      const insertOffer = db.prepare('INSERT INTO offers (market_id, product_id, price, valid_until) VALUES (?, ?, ?, ?)');
      const insertTabloide = db.prepare('INSERT INTO tabloides (market_id, title, pdf_url, valid_until) VALUES (?, ?, ?, ?)');

      const marketIds = markets.map(m => insertMarket.run(...m).lastInsertRowid);
      const productIds = products.map(p => insertProduct.run(...p).lastInsertRowid);

      marketIds.forEach(mId => {
        productIds.forEach(pId => {
          const price = (Math.random() * 25 + 5).toFixed(2);
          insertOffer.run(mId, pId, price, validUntil);
        });
      });

      marketIds.forEach((mId, idx) => {
        insertTabloide.run(mId, `Ofertas de Março - ${markets[idx][0]}`, 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', validUntil);
      });
    }
  }
}

const app = express();
const PORT = 3000;

async function startServer() {
  console.log('Starting server...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  try {
    await initDb();
    console.log('Database initialized.');
  } catch (err) {
    console.error('Failed to initialize database:', err);
    // Don't exit on Vercel, let the request fail
    if (!process.env.VERCEL) process.exit(1);
  }
  
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.get('/api/test', (req, res) => {
    res.send('Server is alive!');
  });

  app.use(express.json());

  // Auth Route
  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Global Admin
    if (username === 'admin' && password === 'admin') {
      return res.json({ id: 0, name: 'Administrador Geral', username: 'admin', role: 'admin' });
    }

    let market;
    if (useTurso) {
      const result = await db.execute({
        sql: 'SELECT id, name, username FROM markets WHERE username = ? AND password = ?',
        args: [username, password]
      });
      market = result.rows[0];
    } else {
      market = db.prepare('SELECT id, name, username FROM markets WHERE username = ? AND password = ?').get(username, password);
    }
    
    if (market) {
      res.json({ ...market, role: 'market' });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  });

  // API Routes
  app.get('/api/markets', async (req, res) => {
    let markets;
    if (useTurso) {
      const result = await db.execute('SELECT * FROM markets');
      markets = result.rows;
    } else {
      markets = db.prepare('SELECT * FROM markets').all();
    }
    res.json(markets);
  });

  app.delete('/api/markets/:id', async (req, res) => {
    const { id } = req.params;
    if (useTurso) {
      await db.execute({ sql: 'DELETE FROM offers WHERE market_id = ?', args: [id] });
      await db.execute({ sql: 'DELETE FROM markets WHERE id = ?', args: [id] });
    } else {
      db.prepare('DELETE FROM offers WHERE market_id = ?').run(id);
      db.prepare('DELETE FROM markets WHERE id = ?').run(id);
    }
    res.json({ success: true });
  });

  app.get('/api/markets/:id', async (req, res) => {
    const { id } = req.params;
    let market;
    if (useTurso) {
      const result = await db.execute({ sql: 'SELECT * FROM markets WHERE id = ?', args: [id] });
      market = result.rows[0];
    } else {
      market = db.prepare('SELECT * FROM markets WHERE id = ?').get(id);
    }
    if (market) {
      res.json(market);
    } else {
      res.status(404).json({ error: 'Market not found' });
    }
  });

  app.get('/api/products', async (req, res) => {
    const { q } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];
    
    if (q) {
      query += ' WHERE name LIKE ? OR brand LIKE ?';
      params.push(`%${q}%`, `%${q}%`);
    }
    
    let products;
    if (useTurso) {
      const result = await db.execute({ sql: query, args: params });
      products = result.rows;
    } else {
      products = db.prepare(query).all(...params);
    }
    res.json(products);
  });

  app.get('/api/categories', async (req, res) => {
    let categories;
    if (useTurso) {
      const result = await db.execute('SELECT DISTINCT category FROM products WHERE category IS NOT NULL');
      categories = result.rows;
    } else {
      categories = db.prepare('SELECT DISTINCT category FROM products WHERE category IS NOT NULL').all();
    }
    res.json(categories.map((c: any) => c.category));
  });

  app.get('/api/offers', async (req, res) => {
    const { q, sort, markets, products, categories } = req.query;
    let query = `
      SELECT o.*, p.name as product_name, p.brand, p.image_url, p.category, m.name as market_name, m.logo as market_logo 
      FROM offers o
      JOIN products p ON o.product_id = p.id
      JOIN markets m ON o.market_id = m.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (q) {
      query += ' AND (p.name LIKE ? OR p.brand LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    if (markets) {
      const marketIds = (markets as string).split(',');
      query += ` AND m.id IN (${marketIds.map(() => '?').join(',')})`;
      params.push(...marketIds);
    }

    if (products) {
      const productIds = (products as string).split(',');
      query += ` AND p.id IN (${productIds.map(() => '?').join(',')})`;
      params.push(...productIds);
    }

    if (categories) {
      const categoryList = (categories as string).split(',');
      query += ` AND p.category IN (${categoryList.map(() => '?').join(',')})`;
      params.push(...categoryList);
    }

    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else {
      query += ' ORDER BY o.created_at DESC';
    }

    let offers;
    if (useTurso) {
      const result = await db.execute({ sql: query, args: params });
      offers = result.rows;
    } else {
      offers = db.prepare(query).all(...params);
    }
    res.json(offers);
  });

  app.delete('/api/offers/:id', async (req, res) => {
    const { id } = req.params;
    if (useTurso) {
      await db.execute({ sql: 'DELETE FROM offers WHERE id = ?', args: [id] });
    } else {
      db.prepare('DELETE FROM offers WHERE id = ?').run(id);
    }
    res.json({ success: true });
  });

  app.get('/api/tabloides', async (req, res) => {
    const query = `
      SELECT t.*, m.name as market_name, m.logo as market_logo
      FROM tabloides t
      JOIN markets m ON t.market_id = m.id
      ORDER BY t.created_at DESC
    `;
    let tabloides;
    if (useTurso) {
      const result = await db.execute(query);
      tabloides = result.rows;
    } else {
      tabloides = db.prepare(query).all();
    }
    res.json(tabloides);
  });

  app.post('/api/tabloides', async (req, res) => {
    const { market_id, title, pdf_url, valid_until } = req.body;
    if (useTurso) {
      const result = await db.execute({
        sql: 'INSERT INTO tabloides (market_id, title, pdf_url, valid_until) VALUES (?, ?, ?, ?)',
        args: [market_id, title, pdf_url, valid_until]
      });
      res.json({ id: result.lastInsertRowid });
    } else {
      const stmt = db.prepare('INSERT INTO tabloides (market_id, title, pdf_url, valid_until) VALUES (?, ?, ?, ?)');
      const result = stmt.run(market_id, title, pdf_url, valid_until);
      res.json({ id: result.lastInsertRowid });
    }
  });

  app.delete('/api/tabloides/:id', async (req, res) => {
    const { id } = req.params;
    if (useTurso) {
      await db.execute({ sql: 'DELETE FROM tabloides WHERE id = ?', args: [id] });
    } else {
      db.prepare('DELETE FROM tabloides WHERE id = ?').run(id);
    }
    res.json({ success: true });
  });
  
  // Admin routes (simplified)
  app.post('/api/admin/markets', async (req, res) => {
    const { name, logo, address, phone, hours } = req.body;
    if (useTurso) {
      const result = await db.execute({
        sql: 'INSERT INTO markets (name, logo, address, phone, hours) VALUES (?, ?, ?, ?, ?)',
        args: [name, logo, address, phone, hours]
      });
      res.json({ id: result.lastInsertRowid });
    } else {
      const stmt = db.prepare('INSERT INTO markets (name, logo, address, phone, hours) VALUES (?, ?, ?, ?, ?)');
      const result = stmt.run(name, logo, address, phone, hours);
      res.json({ id: result.lastInsertRowid });
    }
  });

  app.post('/api/admin/products', async (req, res) => {
    const { name, brand, category, image_url } = req.body;
    if (useTurso) {
      const result = await db.execute({
        sql: 'INSERT INTO products (name, brand, category, image_url) VALUES (?, ?, ?, ?)',
        args: [name, brand, category, image_url]
      });
      res.json({ id: result.lastInsertRowid });
    } else {
      const stmt = db.prepare('INSERT INTO products (name, brand, category, image_url) VALUES (?, ?, ?, ?)');
      const result = stmt.run(name, brand, category, image_url);
      res.json({ id: result.lastInsertRowid });
    }
  });

  app.post('/api/admin/offers', async (req, res) => {
    const { market_id, product_id, price, valid_until } = req.body;
    if (useTurso) {
      const result = await db.execute({
        sql: 'INSERT INTO offers (market_id, product_id, price, valid_until) VALUES (?, ?, ?, ?)',
        args: [market_id, product_id, price, valid_until]
      });
      res.json({ id: result.lastInsertRowid });
    } else {
      const stmt = db.prepare('INSERT INTO offers (market_id, product_id, price, valid_until) VALUES (?, ?, ?, ?)');
      const result = stmt.run(market_id, product_id, price, valid_until);
      res.json({ id: result.lastInsertRowid });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    // Fallback for SPA in development
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

// Start initialization
startServer();

export default app;
