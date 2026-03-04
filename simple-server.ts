import express from 'express';
const app = express();
app.get('*', (req, res) => {
  res.send('Hello from simple server! Path: ' + req.url);
});
app.listen(3000, '0.0.0.0', () => {
  console.log('Simple server listening on 3000');
});
