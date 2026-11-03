require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { MONGODB_URI, JWT_SECRET, PORT = 3000 } = process.env;
if (!MONGODB_URI || !JWT_SECRET) throw new Error('Set MONGODB_URI and JWT_SECRET environment variables');

const CATS = ['Food', 'Travel', 'Clothes', 'Other'];

const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 40 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  limit: {
    on: { type: Boolean, default: false },
    amt: { type: Number, default: 0, min: 0, max: 100000000 }
  }
}, { timestamps: true }));

const userOut = u => ({
  name: u.name,
  email: u.email,
  createdAt: u.createdAt,
  limit: { on: !!(u.limit && u.limit.on), amt: (u.limit && u.limit.amt) || 0 }
});

const Expense = mongoose.model('Expense', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  amt: { type: Number, required: true, min: 0.01 },
  mode: { type: String, required: true, enum: ['UPI', 'Cash', 'Card', 'Other'] },
  other: { type: String, default: '', maxlength: 30, trim: true },
  cat: { type: String, enum: CATS, default: 'Other' },
  what: { type: String, required: true, maxlength: 60, trim: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ }
}, { timestamps: true }));

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '10kb' }));
// Locally this serves the page; on Vercel the public/ folder is served by its CDN.
app.use(express.static(path.join(__dirname, 'public')));

// Serverless-friendly cached MongoDB connection (reused between requests)
const cache = global._spendoraMongo || (global._spendoraMongo = { conn: null, p: null });
async function db() {
  if (cache.conn) return cache.conn;
  if (!cache.p) cache.p = mongoose.connect(MONGODB_URI, { dbName: 'spendora', serverSelectionTimeoutMS: 8000, bufferCommands: false });
  try { cache.conn = await cache.p; } catch (e) { cache.p = null; throw e; }
  return cache.conn;
}
app.use('/api', async (req, res, next) => {
  try { await db(); next(); }
  catch (e) { console.error('DB error:', e.message); res.status(503).json({ error: 'Database unavailable. Try again.' }); }
});

const wrap = fn => (req, res) => fn(req, res).catch(e => {
  if (e.code === 11000) return res.status(409).json({ error: 'An account with this email already exists.' });
  if (e.name === 'ValidationError' || e.name === 'CastError') return res.status(400).json({ error: 'Invalid data.' });
  console.error(e); res.status(500).json({ error: 'Server error. Try again.' });
});
const sign = u => jwt.sign({ uid: u._id }, JWT_SECRET, { expiresIn: '30d' });
const auth = (req, res, next) => {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  try { req.uid = jwt.verify(t, JWT_SECRET).uid; next(); }
  catch { res.status(401).json({ error: 'Please sign in again.' }); }
};
const pick = b => ({ amt: Number(b.amt), mode: b.mode, other: b.mode === 'Other' ? String(b.other || '') : '', cat: CATS.includes(b.cat) ? b.cat : 'Other', what: String(b.what || ''), date: String(b.date || '') });

const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many attempts. Try again later.' } });

app.post('/api/auth/register', authLimit, wrap(async (req, res) => {
  const { name = '', email = '', password = '' } = req.body;
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email.' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  const u = await User.create({ name: name.trim() || email.split('@')[0], email, passwordHash: await bcrypt.hash(password, 12) });
  res.json({ token: sign(u), user: userOut(u) });
}));

app.post('/api/auth/login', authLimit, wrap(async (req, res) => {
  const u = await User.findOne({ email: String(req.body.email || '').toLowerCase().trim() });
  const ok = u && await bcrypt.compare(String(req.body.password || ''), u.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Incorrect email or password.' });
  res.json({ token: sign(u), user: userOut(u) });
}));

app.get('/api/auth/me', auth, wrap(async (req, res) => {
  const u = await User.findById(req.uid);
  if (!u) return res.status(401).json({ error: 'Please sign in again.' });
  res.json(userOut(u));
}));

app.put('/api/auth/me', auth, wrap(async (req, res) => {
  const name = String(req.body.name || '').trim();
  if (!name || name.length > 40) return res.status(400).json({ error: 'Name must be 1 to 40 characters.' });
  const u = await User.findByIdAndUpdate(req.uid, { name }, { new: true });
  if (!u) return res.status(401).json({ error: 'Please sign in again.' });
  res.json(userOut(u));
}));

app.put('/api/auth/password', authLimit, auth, wrap(async (req, res) => {
  const current = String(req.body.current || ''), next = String(req.body.next || '');
  if (next.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  const u = await User.findById(req.uid);
  if (!u) return res.status(401).json({ error: 'Please sign in again.' });
  // 400 (not 401) so a wrong current password does not sign the user out
  if (!(await bcrypt.compare(current, u.passwordHash))) return res.status(400).json({ error: 'Current password is incorrect.' });
  u.passwordHash = await bcrypt.hash(next, 12);
  await u.save();
  res.json({ ok: true });
}));

app.put('/api/auth/limit', auth, wrap(async (req, res) => {
  const on = !!req.body.on, amt = Number(req.body.amt) || 0;
  if (amt < 0 || amt > 100000000) return res.status(400).json({ error: 'Enter a valid limit.' });
  if (on && !(amt > 0)) return res.status(400).json({ error: 'Enter a limit greater than 0.' });
  const u = await User.findByIdAndUpdate(req.uid, { limit: { on, amt } }, { new: true });
  if (!u) return res.status(401).json({ error: 'Please sign in again.' });
  res.json(userOut(u));
}));

app.get('/api/expenses', auth, wrap(async (req, res) => res.json(await Expense.find({ userId: req.uid }).sort({ date: -1, _id: -1 }).lean())));
app.post('/api/expenses', auth, wrap(async (req, res) => res.json((await Expense.create({ ...pick(req.body), userId: req.uid })).toObject())));
app.put('/api/expenses/:id', auth, wrap(async (req, res) => {
  const e = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.uid }, pick(req.body), { new: true, runValidators: true }).lean();
  e ? res.json(e) : res.status(404).json({ error: 'Expense not found.' });
}));
app.delete('/api/expenses/:id', auth, wrap(async (req, res) => {
  const r = await Expense.deleteOne({ _id: req.params.id, userId: req.uid });
  r.deletedCount ? res.json({ ok: true }) : res.status(404).json({ error: 'Expense not found.' });
}));

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log('Spendora running on port ' + port));
}
module.exports = app;
