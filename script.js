const display = document.querySelector('#display');
const keys = document.querySelector('.keys');

const state = {
  current: '0',
  previous: null,
  operator: null,
  resetOnNextDigit: false,
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return 'Error';
  return parseFloat(value.toFixed(10)).toString();
};

const calculate = (left, right, operator) => {
  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return right === 0 ? Infinity : left / right;
    default:
      return right;
  }
};

const updateDisplay = () => {
  display.value = state.current;
};

const inputDigit = (digit) => {
  if (state.resetOnNextDigit) {
    state.current = digit;
    state.resetOnNextDigit = false;
    return;
  }

  state.current = state.current === '0' ? digit : state.current + digit;
};

const inputDecimal = () => {
  if (state.resetOnNextDigit) {
    state.current = '0.';
    state.resetOnNextDigit = false;
    return;
  }

  if (!state.current.includes('.')) {
    state.current += '.';
  }
};

const clearAll = () => {
  state.current = '0';
  state.previous = null;
  state.operator = null;
  state.resetOnNextDigit = false;
};

const toggleSign = () => {
  if (state.current === '0') return;
  state.current = state.current.startsWith('-')
    ? state.current.slice(1)
    : `-${state.current}`;
};

const applyPercent = () => {
  state.current = formatNumber(parseFloat(state.current) / 100);
};

const handleOperator = (nextOperator) => {
  const inputValue = parseFloat(state.current);

  if (state.operator && state.previous !== null && !state.resetOnNextDigit) {
    const result = calculate(state.previous, inputValue, state.operator);
    state.current = formatNumber(result);
    state.previous = Number.parseFloat(state.current);
  } else {
    state.previous = inputValue;
  }

  state.operator = nextOperator;
  state.resetOnNextDigit = true;
};

const handleEquals = () => {
  if (!state.operator || state.previous === null) return;

  const inputValue = parseFloat(state.current);
  const result = calculate(state.previous, inputValue, state.operator);

  state.current = formatNumber(result);
  state.previous = null;
  state.operator = null;
  state.resetOnNextDigit = true;
};

keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  switch (action) {
    case 'digit':
      inputDigit(value);
      break;
    case 'decimal':
      inputDecimal();
      break;
    case 'clear':
      clearAll();
      break;
    case 'sign':
      toggleSign();
      break;
    case 'percent':
      applyPercent();
      break;
    case 'operator':
      handleOperator(value);
      break;
    case 'equals':
      handleEquals();
      break;
    default:
      return;
  }

  updateDisplay();
});

updateDisplay();
