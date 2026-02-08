const bcrypt = require('bcryptjs');

// Get password from command line argument or use default
const password = process.argv[2] || 'VIP2026';

// Generate bcrypt hash with 10 rounds
const hash = bcrypt.hashSync(password, 10);

console.log('='.repeat(50));
console.log('PASSWORD HASH GENERATOR');
console.log('='.repeat(50));
console.log('');
console.log('Original Password:', password);
console.log('');
console.log('Bcrypt Hash:');
console.log(hash);
console.log('');
console.log('Add this to your Render environment variables:');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log('');
console.log('='.repeat(50));
