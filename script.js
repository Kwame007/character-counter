// select DOM elements
const body = document.getElementById('body')
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
const svg = document.querySelector('.chevron');



letterDensityGraph.textContent = 'No characters found. Start typing to see letter density.';


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

  if (sortedCharacters.length === 0) {
    letterDensityGraph.textContent = 'No characters found. Start typing to see letter density.';
    return;
  } else {
    letterDensityGraph.style.display = 'flex';
  }

  const showLimit = 3;
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

    // Animate bar fill
    requestAnimationFrame(() => {
      barFill.classList.add('animate');
    });

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


  // Re-append the SVG so it's not overwritten by textContent
  showMoreBtn.appendChild(svg);

  // Rotate the chevron
  showMoreBtn.classList.toggle('expanded', isExpanded);
  };
  }

}


// listen for user input
textInput.addEventListener("keyup", (e) => {
  // get every text value
  const textValue = e.target.value;

  // set padded values
  const paddedWordCount = padIfLessThan10(countWords(textValue));
  const paddedSentenceCount = padIfLessThan10(textValue.split(/[.!?]/).length - 1);

  let charCount;

  // check if exclude spaces checked
  if (excludeSpaces.checked) {
    // remove spaces
    charCount = textValue.replace(/\s+/g, '').length;
  } else {
    charCount = textValue.length;
  }

  const paddedCharCount = padIfLessThan10(charCount);

  // check if character limit checked
  if (charLimit.checked && Number(limitInput.value) > 0) {
    const limit = Number(limitInput.value);

    if (charCount > limit) {
      textInput.style.border = 'none';
      textInput.style.boxShadow = "0px 0px 8px 0px rgba(218,55,1,0.8)";

      // show error message
      errorMessage.classList.remove('card__error--hidden');
      errorMessage.style.display = 'flex';

      errorText.textContent = `Limit reached! Your text exceeds ${limit} characters`
    } else {
      textInput.style.boxShadow = "0px 0px 10px 0px #c27cf8";

       // hide error message
      errorMessage.classList.add('card__error--hidden');
      errorMessage.style.display = 'none';
      
    }
  }

  // Update results with padded values
  resultsValues[0].textContent = paddedCharCount;
  resultsValues[1].textContent = paddedWordCount;
  resultsValues[2].textContent = paddedSentenceCount;

  // show estimated reading time
  readingTime.textContent = ` ${Math.ceil(charCount / 200)} minutes`;

  letterDensity(textValue)
});


// listen for text input focus
textInput.addEventListener('focus',()=>{
  let limitValue = limitInput.value;
if (textInput.value.length > limitValue && charLimit.checked) {

      textInput.style.border = 'none';
      textInput.style.boxShadow = "0px 0px 8px 0px rgba(218,55,1,0.8)";

      // show error message
      errorMessage.classList.remove('card__error--hidden');
      errorMessage.style.display = 'flex';

      errorText.textContent = `Limit reached! Your text exceeds ${limitValue} characters`

    } else {
      textInput.style.boxShadow = "0px 0px 10px 0px #c27cf8";
    }

    if(Number(limitInput.value) === 0){
      limitValue = 0
      // set limit value to zero
      limitInput.value = limitValue;
    }
  })

  // listen for text input blur
  textInput.addEventListener('blur',()=>{
    textInput.style.border = '1px solid #e4e4ef';
    textInput.style.boxShadow = "none";
  })

  // listen for exclude spaces checked
  excludeSpaces.addEventListener('change',()=>{
    const limit = Number(limitInput.value);
    let value;

    if(excludeSpaces.checked){
      value =textInput.value.replace(/\s+/g, '').length;
      // update total characters
      resultsValues[0].textContent =padIfLessThan10(value);

    }else{
      value = textInput.value.length;
        resultsValues[0].textContent = padIfLessThan10(value);
    }

    if(charLimit.checked ){
    
      if(value > limit){
        textInput.style.border = 'none';
        textInput.style.boxShadow =  "0px 0px 8px 0px rgba(218,55,1,0.8)";

        // show error message
        errorMessage.classList.remove('card__error--hidden');
        errorMessage.style.display = 'flex';

        errorText.textContent = `Limit reached! Your text exceeds ${limit} characters`
      } else {
      textInput.style.boxShadow =  "0px 0px 10px 0px #c27cf8";

      // hide error message
        errorMessage.classList.add('card__error--hidden');
        errorMessage.style.display = 'none';
      } 
    }
  })


  // listen for character limit checked
  charLimit.addEventListener('change',()=>{ 
  
    if(charLimit.checked){
      // show limit input
      limitInput.classList.remove('card__limit--hidden');

      // set focus on limit input
      limitInput.focus();
    }else{
      // clear limit input
      limitInput.value = '';

      // hide limit input
      limitInput.classList.add('card__limit--hidden');

      textInput.style.boxShadow =  "0px 0px 10px 0px #c27cf8";

      // hide error message
        errorMessage.classList.add('card__error--hidden');
        errorMessage.style.display = 'none';
    }
  })


// listen for limit
limitInput.addEventListener('keyup',()=>{
  const textInputValue = textInput.value;
  let limitValue;

  if(isNaN(Number(limitInput.value))){
    limitInput.value = '';
    limitValue = '';
  }else{
    limitValue= Number(limitInput.value);
  }

  if(textInputValue.length > limitValue){
    textInput.style.border = 'none';
    textInput.style.boxShadow =  "0px 0px 8px 0px rgba(218,55,1,0.8)";

    // show error message
    errorMessage.classList.remove('card__error--hidden');
    errorMessage.style.display = 'flex';

    errorText.textContent = `Limit reached! Your text exceeds ${limitValue} characters`
  }else{
    textInput.style.boxShadow =  "0px 0px 10px 0px #c27cf8";

    // hide error message
    errorMessage.classList.add('card__error--hidden');
    errorMessage.style.display = 'none';
  }
})

// toggle dark theme
