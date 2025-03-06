const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');


dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  const userData = {
    username: 'admin',
    password: 'deinPasswort', // Wird im Pre-Save-Hook gehasht
    email: 'admin@example.com',
    role: 'admin', // oder 'manager', 'owner', 'repark'
  };

  try {
    const user = new User(userData);
    await user.save();
    console.log('Benutzer erfolgreich erstellt!');
  } catch (err) {
    console.error('Fehler beim Erstellen des Benutzers:', err);
  }
  mongoose.connection.close();
})
.catch(err => console.error('MongoDB-Verbindungsfehler:', err));
