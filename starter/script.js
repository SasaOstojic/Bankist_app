'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// My Ban App

// Data
const sasaaccount = {
  owner: 'Sasa Ostojic',
  arrItems: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const markoaccount = {
  owner: 'Marko Markovic',
  arrItems: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const urosaccount = {
  owner: 'Uros Zivkovic',
  arrItems: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const bojanaccount = {
  owner: 'Bojan Dragojevic',
  arrItems: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const peopleAccounts = [sasaaccount, markoaccount, urosaccount, bojanaccount];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerarrItems = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayarrItems = function (arrItems, sort = false) {
  containerarrItems.innerHTML = '';

  //First we make copy of an array using slice() method than compare function to do descending order array
  const arr = sort ? arrItems.slice().sort((a,b) => a - b) : arrItems;
  arr.forEach((key, index) => {
    const type = key > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
                  <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
                  <div class="movements__value">${key}</div>
                </div>
                `;

    containerarrItems.insertAdjacentHTML('afterbegin', html);
  });
};



const worldCurrencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const printSumBalance = function (account) {
  account.balance = account.arrItems.reduce((sum, curr) => {
    return sum + curr;
  }, 0);
  labelBalance.textContent = `${account.balance} EUR`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.arrItems
    .filter(item => item > 0)
    .reduce((account, item) => account + item, 0);
  labelSumIn.textContent = `${incomes} EUR`;

  const out = account.arrItems
    .filter(item => item < 0)
    .reduce((account, item) => account + item, 0);
  labelSumOut.textContent = `${Math.abs(out)} EUR`;

  const interest = account.arrItems
    .filter(item => item > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((sum, int) => sum + int, 0);
  labelSumInterest.textContent = `${interest} EUR`;
};

function createUserNames(accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}

createUserNames(peopleAccounts);

const updateUI = function (account) {
  //Dsiplay arrItems
  displayarrItems(account.arrItems);
  //Display ballance
  printSumBalance(account);
  //Display summary
  calcDisplaySummary(account);
};

//Event handlers
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();
  currentAccount = peopleAccounts.find(
    account => account.username === inputLoginUsername.value
  );
  console.log(peopleAccounts);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI nad welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear input fields after login
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', (e)=> {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.arrItems.some(item => item >= amount * 0.1)){
    //Add item
    currentAccount.arrItems.push(amount);

    //Update UI
    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }
})



//Transfering amounts

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiveaccount = peopleAccounts.find(
    account => account.username === inputTransferTo.value
  );

  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiveaccount?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.arrItems.push(-amount);
    receiveaccount.arrItems.push(amount);
    updateUI(currentAccount);
  }
});

//Close account handler

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = peopleAccounts.findIndex(
      account => account.username === currentAccount.username
    );

    //Delete account
    peopleAccounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;

    inputCloseUsername.value = '';
    inputClosePin.value = '';
  }
});

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();

  displayarrItems(currentAccount.arrItems, !sorted);
  sorted = !sorted;

})

const arrItems = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const eurToUsd = 1.1;

const arrItemsUSD = arrItems.map(key => {
  return key * eurToUsd;
});

const maximumValue = arrItems.reduce((acm, curr) => {
  if (acm > curr) {
    return acm;
  } else {
    return curr;
  }
}, arrItems[0]);

const totalDepositUsd = arrItems
  .filter(item => item > 0)
  .map(item => item * eurToUsd)
  .reduce((account, item) => account + item, 0);
console.log(totalDepositUsd);


const overallBallance = peopleAccounts.flatMap(account => account.arrItems).reduce((account, item) => account + item, 0);

arrItems.sort((a,b) => {
  if(a > b) return 1;
  if(b > a) return -1;
})
