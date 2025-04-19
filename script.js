// select DOM elements
const textInput = document.getElementById("text-input");
const excludeSpaces  = document.getElementById("exclude-spaces");
const charLimit  = document.getElementById("char-limit");
const resultsValues = document.querySelectorAll('.results__value');
const limitInput = document.querySelector('.card__limit');
const errorMessage = document.querySelector('.card__error');
const errorText = document.querySelector('.card__error-text');
const readingTime = document.querySelector('.card__reading-time-value');
const letterDensityGraph = document.querySelector('.results__letter-density-graph');
const limit = document.getElementById('limit');
const letterDensityDescription = document.querySelector('.results__letter-density-description');
const showMoreBtn = document.querySelector('.results__letter-density-button');
const btnText = document.querySelector('.btn-text');

let previousLimitValue = '';
letterDensityGraph.textContent = 'No characters found. Start typing to see letter density.';


// apply saved theme
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}

// apply theme from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
});

// toggle theme
document.getElementById("theme-toggle").addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
});

// calculate word count
function countWords(str) {
  let words = str.match(/\b\w+\b/g);
  return words ? words.length : 0;
}

// calculate reading time
function calcReadingTime(charCount) {
  return charCount===0?'0 minutes': `${Math.ceil(charCount / 200)} minutes`;
}

// pad if less than 10
function padIfLessThan10(value) {
  return value < 10 ? String(value).padStart(2, '0') : value;
}

// calculate letter density
function letterDensity(inputValue) {
  const characters = inputValue.toUpperCase().replace(/[^A-Z]/g, '');
  const totalCharacters = characters.length;
  const characterMap = {};

  for (let character of characters) {
    characterMap[character] = (characterMap[character] || 0) + 1;
  }

  const sortedCharacters = Object.entries(characterMap).sort((a, b) => b[1] - a[1]);

  letterDensityGraph.innerHTML = '';
  letterDensityDescription.innerHTML = '';
  showMoreBtn.classList.add('hidden');
  showMoreBtn.textContent = 'Show More';
  showMoreBtn.style.color= 'var(--primary-text)';

  if (sortedCharacters.length === 0) {
    letterDensityGraph.textContent = 'No characters found. Start typing to see letter density.';
    return;
  } else {
    letterDensityGraph.style.display = 'flex';
  }

  const showLimit = 5;
  const rows = [];

  sortedCharacters.forEach(([letter, count], index) => {
    const percentage = ((count / totalCharacters) * 100).toFixed(2);
    const barWidth = Math.min(parseFloat(percentage), 100);

    const row = document.createElement('div');
    row.classList.add('results__letter-density-container');
    if (index >= showLimit) {
      row.classList.add('hidden', 'fade-slide'); // Hide by default
    }

    const letterSpan = document.createElement('span');
    letterSpan.classList.add('results__letter-density-letter');
    letterSpan.textContent = letter;

    const barContainer = document.createElement('div');
    barContainer.classList.add('results__letter-density-bar-container');

    const barFill = document.createElement('div');
    barFill.classList.add('results__letter-density-bar-fill');
    barFill.style.width = `${barWidth}%`;

    barContainer.appendChild(barFill);

    const countPara = document.createElement('p');
    countPara.classList.add('count');
    countPara.innerHTML = `${count} <span class="percentage">( ${percentage}%)</span>`;

    row.appendChild(letterSpan);
    row.appendChild(barContainer);
    row.appendChild(countPara);

    letterDensityDescription.appendChild(row);

    rows.push(row);
  });

  // Show More / Show Less logic
  if (sortedCharacters.length > showLimit) {
    showMoreBtn.classList.remove('hidden');

    let isExpanded = false;

    showMoreBtn.onclick = () => {
    isExpanded = !isExpanded;

    rows.forEach((row, index) => {
      if (index >= showLimit) {
        if (isExpanded) {
          row.classList.remove('hidden');
          void row.offsetWidth; // trigger reflow for animation
          row.classList.add('visible');
        } else {
          row.classList.remove('visible');
          row.classList.add('hidden');
        }
      }
    });

  // Only change the button label text — not the SVG!
  btnText.textContent = isExpanded ? 'Show Less' : 'Show More';

  // Rotate the chevron!
  showMoreBtn.classList.toggle('expanded', isExpanded);
  };
  }
}

function updateResults(event) {
  // Get every text value
  const textValue = event.target.value;

  // Set padded values
  const paddedWordCount = padIfLessThan10(countWords(textValue));
  const paddedSentenceCount = padIfLessThan10(textValue.split(/[.!?]/).length - 1);

  let charCount;

  // Check if exclude spaces is checked
  if (excludeSpaces.checked) {
    // Remove spaces
    charCount = textValue.replace(/\s+/g, '').length;
  } else {
    charCount = textValue.length;
  }

  const paddedCharCount = padIfLessThan10(charCount);

  // Check if character limit is checked
  if (charLimit.checked && !isNaN(Number(limitInput.value)) && Number(limitInput.value) > 0) {
    const limit = Number(limitInput.value);

    if (charCount > limit) {
      applyErrorState(`Limit reached! Your text exceeds ${limit} characters`);
    } else {
      resetErrorState();
    }
  } else {
    // Reset error state if charLimit is not checked
    resetErrorState();
  }
  
  // Update results with padded values
  resultsValues[0].textContent = paddedCharCount;
  resultsValues[1].textContent = paddedWordCount;
  resultsValues[2].textContent = paddedSentenceCount;

  // Show estimated reading time
  readingTime.textContent = `${Math.ceil(charCount / 200) <= 1 ? '< 1' : Math.ceil(charCount / 200)} minutes`;

  // Update letter density
  letterDensity(textValue);
}

function updateOnFocus() {
  // Convert limitInput value to a number, default to 0 if invalid
  let limitValue = isNaN(Number(limitInput.value)) || limitInput.value === '' ? 0 : Number(limitInput.value);

  // Recalculate charCount based on excludeSpaces
  const charCount = excludeSpaces.checked
    ? textInput.value.replace(/\s+/g, '').length
    : textInput.value.length;

  // Check if the character limit is enabled and exceeded
  if (charLimit.checked && charCount > limitValue) {
    // Apply error state
    applyErrorState(`Limit reached! Your text exceeds ${limitValue} characters`);
  } else {
    // Reset error state
    resetErrorState();
  }

  // Ensure limitValue is set to 0 if the input is invalid
  if (limitValue === 0) {
    limitInput.value = limitValue;
  }
}

function updateOnCharLimit() {
  if (charLimit.checked) {
    // Show limit input
    limitInput.classList.remove('card__limit--hidden');

    // Restore previous value or set focus if empty
    if (limitInput.value === '') {
      limitInput.value = previousLimitValue;
      limitInput.focus();
    }
  } else {
    // Save current value before clearing
    previousLimitValue = limitInput.value;

    // Clear and hide limit input
    limitInput.value = '';
    limitInput.classList.add('card__limit--hidden');

    // Reset text input box shadow
    textInput.style.boxShadow = "0px 0px 10px 0px var(--purple-light)";

    // Hide error message
    errorMessage.classList.add('card__error--hidden');
    errorMessage.style.display = 'none';
  }
}

  function updateCharacterCountAndLimit() {
  // Get the character limit, default to 0 if invalid
  const limitValue = isNaN(Number(limitInput.value)) || limitInput.value === '' ? 0 : Number(limitInput.value);

  // Calculate the character count based on whether spaces are excluded
  const value = excludeSpaces.checked
    ? textInput.value.replace(/\s+/g, '').length
    : textInput.value.length;

  // Update the total characters display
  resultsValues[0].textContent = padIfLessThan10(value);

  // Check if the character limit is enabled and valid
  if (charLimit.checked && limitValue > 0) {
    if (value > limitValue) {
      applyErrorState(`Limit reached! Your text exceeds ${limitValue} characters`);
    } else {
      resetErrorState();
    }
  } else {
    // Reset error state if charLimit is not checked
    resetErrorState();
  }
}

function updateOnExcludeSpaces() {
  updateCharacterCountAndLimit();
}

function updateOnLimitChange() {
  updateCharacterCountAndLimit();
}

// Helper function to apply error state
function applyErrorState(message) {
  textInput.style.border = 'none';
  textInput.style.boxShadow = "0px 0px 8px 0px var(--orange-light)";
  errorMessage.classList.remove('card__error--hidden');
  errorMessage.style.display = 'flex';
  errorText.textContent = message;
}

// Helper function to reset error state
function resetErrorState() {
  textInput.style.border = '1px solid var(--textfield-border)';
  textInput.style.boxShadow = "0px 0px 10px 0px var(--purple-dark)";
  errorMessage.classList.add('card__error--hidden');
  errorMessage.style.display = 'none';
}


// event listeners
textInput.addEventListener("input", updateResults);
textInput.addEventListener('focus',updateOnFocus)
textInput.addEventListener('blur',()=>{textInput.style.boxShadow = "none"})
excludeSpaces.addEventListener('change',updateOnExcludeSpaces)
charLimit.addEventListener('change',updateOnCharLimit)
limitInput.addEventListener('input',updateOnLimitChange)

