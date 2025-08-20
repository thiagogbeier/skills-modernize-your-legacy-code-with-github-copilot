# Test Plan for School Accounting System (COBOL)

This test plan covers the business logic and user flows implemented in the legacy COBOL application. Use this plan to validate the system with business stakeholders and as a basis for future automated tests.

| Test Case ID | Test Case Description                | Pre-conditions                | Test Steps                                                                 | Expected Result                                   | Actual Result | Status (Pass/Fail) | Comments |
|--------------|--------------------------------------|-------------------------------|----------------------------------------------------------------------------|---------------------------------------------------|---------------|--------------------|----------|
| TC-01        | View initial account balance         | Application is started        | 1. Start the app. 2. Select 'View Balance' (option 1).                   | Displays the current account balance (default 1000)|               |                    |          |
| TC-02        | Credit account with valid amount     | Application is started        | 1. Start the app. 2. Select 'Credit Account' (option 2). 3. Enter 100.   | Balance increases by 100; confirmation is shown    |               |                    |          |
| TC-03        | Debit account with valid amount      | Application is started, balance >= debit amount | 1. Start the app. 2. Select 'Debit Account' (option 3). 3. Enter 50.    | Balance decreases by 50; confirmation is shown     |               |                    |          |
| TC-04        | Debit account with amount > balance  | Application is started, balance < debit amount  | 1. Start the app. 2. Select 'Debit Account' (option 3). 3. Enter 2000.  | Error message for insufficient funds is shown      |               |                    |          |
| TC-05        | Credit account with invalid input    | Application is started        | 1. Start the app. 2. Select 'Credit Account' (option 2). 3. Enter 'abc'. | Error message for invalid input is shown           |               |                    |          |
| TC-06        | Debit account with invalid input     | Application is started        | 1. Start the app. 2. Select 'Debit Account' (option 3). 3. Enter 'xyz'.  | Error message for invalid input is shown           |               |                    |          |
| TC-07        | Exit the application                | Application is started        | 1. Start the app. 2. Select 'Exit' (option 4).                          | Application exits with goodbye message             |               |                    |          |

---

Fill in the 'Actual Result', 'Status', and 'Comments' columns during test execution. This plan can be adapted for automated testing in the Node.js version
