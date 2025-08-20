
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DATA_FILE = path.join(__dirname, '../balance.json');
const APP_PATH = path.join(__dirname, 'index.js');

describe('Account Management System', function () {
  this.timeout(5000);

  beforeEach(function () {
    if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
  });

  afterEach(function () {
    if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
  });

  function runAppWithInputs(inputs, assertions, done) {
    const child = spawn('node', [APP_PATH], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, INITIAL_BALANCE: '1000' }
    });
    let collected = '';
    child.stdout.on('data', (data) => {
      collected += data.toString();
    });
    child.stderr.on('data', (data) => {
      collected += data.toString();
    });
    // Send all inputs with a small delay to ensure prompts are ready
    let idx = 0;
    function sendInput() {
      if (idx < inputs.length) {
        child.stdin.write(inputs[idx] + '\n');
        idx++;
        setTimeout(sendInput, 100);
      } else {
        // Wait a bit then end input
        setTimeout(() => child.stdin.end(), 200);
      }
    }
    setTimeout(sendInput, 100);
    child.on('close', () => {
      assertions(collected);
      done();
    });
  }

  it('TC-01: View initial account balance', function (done) {
    runAppWithInputs(['1', '4'], (collected) => {
      expect(collected).to.include('Current balance: 1000.00');
    }, done);
  });

  it('TC-02: Credit account with valid amount', function (done) {
    runAppWithInputs(['2', '100', '1', '4'], (collected) => {
      expect(collected).to.include('Amount credited. New balance: 1100.00');
      expect(collected).to.include('Current balance: 1100.00');
    }, done);
  });

  it('TC-03: Debit account with valid amount', function (done) {
    runAppWithInputs(['3', '50', '1', '4'], (collected) => {
      expect(collected).to.include('Amount debited. New balance: 950.00');
      expect(collected).to.include('Current balance: 950.00');
    }, done);
  });

  it('TC-04: Debit account with amount > balance', function (done) {
    runAppWithInputs(['3', '2000', '4'], (collected) => {
      expect(collected).to.include('Insufficient funds.');
    }, done);
  });

  it('TC-05: Credit account with invalid input', function (done) {
    runAppWithInputs(['2', 'abc', '4'], (collected) => {
      expect(collected).to.include('Invalid input. Please enter a positive number.');
    }, done);
  });

  it('TC-06: Debit account with invalid input', function (done) {
    runAppWithInputs(['3', 'xyz', '4'], (collected) => {
      expect(collected).to.include('Invalid input. Please enter a positive number.');
    }, done);
  });

  it('TC-07: Exit the application', function (done) {
    runAppWithInputs(['4'], (collected) => {
      expect(collected).to.include('Exiting the program. Goodbye!');
    }, done);
  });
});
