import mongoose from 'mongoose';
console.log('Test file starting');
mongoose.connect('mongodb://localhost:27017/cognisphere')
  .then(()=> { console.log('connected'); process.exit(0); })
  .catch(e => { console.log('connection error:', e.message); process.exit(1); });
