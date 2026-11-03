// Local development entry. On Vercel, api/index.js is used instead.
const express = require('express');
const path = require('path');
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log('Spendora running on port ' + PORT));
