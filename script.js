const incomeSection = document.querySelector('.income-area');
const expensesSection = document.querySelector('.expenses-area');
const availableMoney = document.querySelector('.available-money');
const addTransactionPanel = document.querySelector('.add-transaction-panel');
const transactionCurrency = document.querySelector('#currency');

const nameInput = document.querySelector('#name');
const amountInput = document.querySelector('#amount');
const categorySelect = document.querySelector('#category');

const addTransactionBtn = document.querySelector('.add-transaction');
const saveBtn = document.querySelector('.save');
const cancelBtn = document.querySelector('.cancel');
const deleteAllBtn = document.querySelector('.delete-all');

const changeThemeButton = document.querySelector('.change');
const changeFontButton = document.querySelector('.font');
const bodyEl = document.querySelector('body');

let root = document.documentElement;
let ID = 0;
let categoryIcon;
let selectedCategory;
let moneyArr = [0];

const showPanel = () => {
    addTransactionPanel.style.display = 'flex';
}

const closePanel = () => {
    addTransactionPanel.style.display = 'none';
    clearInputs();
}

const checkForm = () => {
    if (nameInput.value !== '' && amountInput.value !== '' && categorySelect.value !== 'none') {
        createNewTransaction();
    } else {
        alert('Wypełnij wszystkie pola!')
    }
}

const clearInputs = () => {
    nameInput.value = '';
    amountInput.value = '';
    categorySelect.selectedIndex = 0;
}

const createNewTransaction = () => {
    if (transactionCurrency.value !== 'pln') {
    fetch(`http://api.nbp.pl/api/exchangerates/rates/a/${transactionCurrency.value}/`)
    .then(res => res.json())
    .then(data => {
        let currencyRate = data.rates[0].mid;
        let newValue = currencyRate * amountInput.value;
        let fixedValue = newValue.toFixed(2);
        const newTransaction = document.createElement('div');
        newTransaction.classList.add('transaction');
        newTransaction.setAttribute('id', ID);
        checkCategory(selectedCategory);
        
        newTransaction.innerHTML = `
        <p class="transaction-name">
        ${categoryIcon} ${nameInput.value}
        </p>
        <p class="transaction-amount">
        ${fixedValue}zł 
        <button class="delete" onclick="deleteTransatcion(${ID})"><i class="fas fa-times"></i></button>
        </p>
    `;

    fixedValue > 0 ? incomeSection.appendChild(newTransaction) && newTransaction.classList.add('income') : expensesSection.appendChild(newTransaction) && newTransaction.classList.add('expense');
    moneyArr.push(parseFloat(fixedValue));
    countMoney(moneyArr)
    closePanel();
    ID++;
    clearInputs();

    })
    } else {
        const newTransaction = document.createElement('div');
        newTransaction.classList.add('transaction');
        newTransaction.setAttribute('id', ID);
        checkCategory(selectedCategory);
    
        newTransaction.innerHTML = `
            <p class="transaction-name">
            ${categoryIcon} ${nameInput.value}
            </p>
            <p class="transaction-amount">
            ${amountInput.value}zł 
            <button class="delete" onclick="deleteTransatcion(${ID})"><i class="fas fa-times"></i></button>
            </p>
        `;
    
        amountInput.value > 0 ? incomeSection.appendChild(newTransaction) && newTransaction.classList.add('income') : expensesSection.appendChild(newTransaction) && newTransaction.classList.add('expense');
        moneyArr.push(parseFloat(amountInput.value));
        countMoney(moneyArr)
        closePanel();
        ID++;
        clearInputs();
    }
}

const selectCategory = () => {
    selectedCategory = categorySelect.options[categorySelect.selectedIndex].text;
}

const checkCategory = transaction => {
    switch (transaction) {
        case 'Przychód':
            categoryIcon = '<i class="fas fa-money-bill-wave"></i>'
            break;
        case 'Zakupy':
            categoryIcon = '<i class="fas fa-cart-arrow-down"></i>'
            break;
        case 'Jedzenie':
            categoryIcon = '<i class="fas fa-hamburger"></i>'
            break;
        case 'Kino':
            categoryIcon = '<i class="fas fa-film"></i>'
            break;
        case 'Rozrywka':
            categoryIcon = '<i class="fas fa-film"></i>'
            break;
        case 'Transport':
            categoryIcon = '<i class="fas fa-bus"></i>'
            break;
        case 'Mieszkanie':
            categoryIcon = '<i class="fas fa-home"></i>'
            break;
        case 'Podróże':
            categoryIcon = '<i class="fas fa-globe-americas"></i>'
            break;
    }
}


const countMoney = money => {
    const newMoney = money.reduce((a, b) => a + b);
    availableMoney.textContent = `${newMoney.toFixed(2)} zł`;
}

const deleteTransatcion = id => {
    const transactionToDelete = document.getElementById(id);
    const transactionAmount = parseFloat(transactionToDelete.childNodes[3].innerText);
    const indexOfTransaction = moneyArr.indexOf(transactionAmount);

    moneyArr.splice(indexOfTransaction, 1)

    transactionToDelete.classList.contains('income') ? incomeSection.removeChild(transactionToDelete) : expensesSection.removeChild(transactionToDelete)
    countMoney(moneyArr)
}

const deleteAllTransactions = () => {
    incomeSection.innerHTML = '<h3>Przychód:</h3>';
    expensesSection.innerHTML = '<h3>Wydatki:</h3>';
    availableMoney.textContent = '0zł'
    moneyArr = [0];
}


const changeThemeStyle = () => {
    if (changeThemeButton.classList.contains('light')) {
      changeThemeButton.classList.remove('light');
      changeThemeButton.classList.add('dark');
      changeFontButton.classList.remove('light');
      changeFontButton.classList.add('dark');
      root.style.setProperty('--first-color', '#333');
      root.style.setProperty('--second-color', '#fff');
      root.style.setProperty('--border-color', '#fff');
    } else if (changeThemeButton.classList.contains('dark')) {
        changeThemeButton.classList.remove('dark');
        changeThemeButton.classList.add('light');
        changeFontButton.classList.remove('dark');
        changeFontButton.classList.add('light');
        root.style.setProperty('--first-color', '#fff');
        root.style.setProperty('--second-color', '#333');
        root.style.setProperty('--border-color', '#333');
    }
}


const changeFontStyle = () => {
    if (changeFontButton.classList.contains('roboto')) {
        changeFontButton.classList.remove('roboto');
        changeFontButton.classList.add('pacifico');
        bodyEl.classList.add('font-pacifico')
        
    } else if (changeFontButton.classList.contains('pacifico')) {
        changeFontButton.classList.remove('pacifico');
        changeFontButton.classList.add('roboto');
        bodyEl.classList.remove('font-pacifico');
    }
}


addTransactionBtn.addEventListener('click', showPanel);
cancelBtn.addEventListener('click', closePanel);
saveBtn.addEventListener('click', checkForm);
deleteAllBtn.addEventListener('click', deleteAllTransactions);


changeThemeButton.addEventListener('click', changeThemeStyle);
changeFontButton.addEventListener('click', changeFontStyle);