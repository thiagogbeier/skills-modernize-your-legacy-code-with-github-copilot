// Node.js implementation of the legacy COBOL accounting system
// Preserves business logic, data integrity, and menu options

const readline = require('readline');
const fs = require('fs');
const DATA_FILE = './balance.json';

// Initialize or load balance data

function loadBalance() {
  // For test repeatability, allow override of initial balance
  const forced = process.env.INITIAL_BALANCE;
  if (forced !== undefined) {
    return parseFloat(forced);
  }
  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return typeof data.balance === 'number' ? data.balance : 1000;
  }
  return 1000;
}

function saveBalance(balance) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ balance }));
}

function showMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

function promptInput(rl, prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  let balance = loadBalance();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  while (true) {
    showMenu();
    const choice = await promptInput(rl, 'Enter your choice (1-4): ');
    if (choice === '1') {
      console.log(`Current balance: ${balance.toFixed(2)}`);
    } else if (choice === '2') {
      const amountStr = await promptInput(rl, 'Enter credit amount: ');
      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        console.log('Invalid input. Please enter a positive number.');
      } else {
        balance += amount;
        saveBalance(balance);
        console.log(`Amount credited. New balance: ${balance.toFixed(2)}`);
      }
    } else if (choice === '3') {
      const amountStr = await promptInput(rl, 'Enter debit amount: ');
      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        console.log('Invalid input. Please enter a positive number.');
      } else if (amount > balance) {
        console.log('Insufficient funds.');
      } else {
        balance -= amount;
        saveBalance(balance);
        console.log(`Amount debited. New balance: ${balance.toFixed(2)}`);
      }
    } else if (choice === '4') {
      console.log('Exiting the program. Goodbye!');
      rl.close();
      break;
    } else {
      console.log('Invalid choice. Please select 1-4.');
    }
  }
}

if (require.main === module) {
  main();
}
