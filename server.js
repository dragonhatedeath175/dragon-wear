const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const BASE_URL = process.env.BASE_URL || '';
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const dataDir = path.join(__dirname, 'data');
const ordersFile = path.join(dataDir, 'orders.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, '[]');

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'dragon-wear' }));

function readOrders(){ try { return JSON.parse(fs.readFileSync(ordersFile, 'utf8')); } catch { return []; } }
function writeOrders(x){ fs.writeFileSync(ordersFile, JSON.stringify(x, null, 2)); }
function orderRef(){ return 'DW' + Date.now().toString().slice(-8) + crypto.randomBytes(2).toString('hex').toUpperCase(); }

app.post('/api/payments/initialize', async (req, res) => {
  if (!PAYSTACK_SECRET_KEY) return res.status(503).json({ error: 'Paystack is not configured yet. Add PAYSTACK_SECRET_KEY in Render environment variables.' });
  const { customer, cart } = req.body || {};
  if (!customer?.email || !Array.isArray(cart) || !cart.length) return res.status(400).json({ error: 'Invalid checkout data.' });
  // Frontend prices are never trusted here. A production deployment should validate the cart against a server-side catalog/database.
  // This endpoint deliberately refuses to invent a payable amount from client input.
  return res.status(501).json({ error: 'Payment catalog verification must be connected to the server-side product database before live payments are enabled.' });
});

app.post('/api/paystack/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!PAYSTACK_SECRET_KEY) return res.status(503).send('Webhook not configured');
  const signature = req.headers['x-paystack-signature'];
  const expected = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(req.body).digest('hex');
  if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return res.status(401).send('Invalid signature');
  let event; try { event = JSON.parse(req.body.toString('utf8')); } catch { return res.status(400).send('Invalid JSON'); }
  const orders = readOrders();
  if (event?.data?.reference) orders.push({ reference:event.data.reference, status:event.event, receivedAt:new Date().toISOString() });
  writeOrders(orders);
  res.sendStatus(200);
});

app.get('/api/orders/:reference', (req, res) => {
  const order = readOrders().find(x => x.id === req.params.reference || x.reference === req.params.reference);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Express 5 catch-all syntax: do not use app.get('*').
app.get('/{*splat}', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => console.log(`DRAGON WEAR listening on port ${PORT}`));
