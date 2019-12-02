const bcrypt = require('bcrypt');

async function hash() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('pass', salt)
}