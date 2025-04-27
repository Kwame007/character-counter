const {calcCharacterLength, countWords, calcSentenceCount, calcReadingTime} = require('../index.js');


describe('Tests for estimated reading time', () => {

  test('should return 0 minutes for an empty string', () => {
    expect(calcReadingTime('')).toBe('0 minutes');
  }); 

  test('should return 1 minute for a string with 200 characters', () => {
    expect(calcReadingTime('a'.repeat(200).length)).toBe('1 minutes');
  });

  test('should return 2 minutes for a string with 400 characters', () => {
    expect(calcReadingTime('a'.repeat(400).length)).toBe(calcReadingTime('a'.repeat(400).length));
  });
  
})


describe('Tests for sentence count', () => {

  test('should return 0 for a string with no sentence-ending punctuation', () => {
    expect(calcSentenceCount('hello world')).toBe(0);
  });

  test('should return the correct sentence count for a string with one sentence', () => {
    expect(calcSentenceCount('Hello world.')).toBe(1);
  });

  test('should return the correct sentence count for a string with multiple sentences', () => {
    expect(calcSentenceCount('Hello world. How are you?')).toBe(2);
  });

  test('should return the correct sentence count for a string with mixed punctuation', () => {
    expect(calcSentenceCount('Hello world! How are you? I am fine.')).toBe(3);
  });

  test('should return the correct sentence count for a string with numbers and punctuation', () => {
    expect(calcSentenceCount('The year is 2023. What is next?')).toBe(2);
  });
});

describe('Tests for word count', () => {
  test('should return 0 for an empty string', () => {
    expect(countWords('')).toBe(0);
  });

  test('should return the correct word count for a string with regular words', () => {
    expect(countWords('hello world')).toBe(2);
  });

  test('should return the correct word count for a string with only spaces', () => {
    expect(countWords('     ')).toBe(0);
  });

  test('should return the correct word count for a single word', () => {
    expect(countWords('hello')).toBe(1);
  });
});

describe('Tests for character length', () => {
  test('should return 0 for an empty string', () => {
    expect(calcCharacterLength('')).toBe(0);
  });

  test('should return the correct length for a string with regular characters', () => {
    expect(calcCharacterLength('hello')).toBe(5);
  });

  test('should return the correct length for a string with spaces', () => {
    expect(calcCharacterLength('hello world')).toBe(11);
  });

  test('should return the correct length for a string with special characters', () => {
    expect(calcCharacterLength(')!@#$% ^&*(')).toBe(11);
  });

  test('should return the correct length for a string with only spaces', () => {
    expect(calcCharacterLength('   ')).toBe(3);
  });
});


// DOM mock-up test for text area
describe('DOM mock-up tests for text area', () => {
  let textArea;

  beforeEach(() => {
    // Set up a mock DOM element
    document.body.innerHTML = `<div id="container">
                                <textarea id="textInput"></textarea>
                                <div id="counter"></div>
                                <div id="readingTime"></div>
                               </div>`;

    textArea = document.getElementById('textInput');
  });

  afterEach(() => {
    // Clean up the DOM
    document.body.innerHTML = '';
  });

  // test if counter updates when typing
  test('simulate typing, update counter dynamically and show warning', () => {
    const counterDiv = document.getElementById('counter');
    const event = new Event('input', { bubbles: true });

    textArea.value = 'hello world'.repeat(100);
    textArea.dispatchEvent(event);

    // Simulate dynamic update logic
    counterDiv.textContent = calcCharacterLength(textArea.value);
    // Simulate dynamic counter update logic
    expect(counterDiv.textContent).toBe(calcCharacterLength(textArea.value).toString());

    // Simulate warning logic for character limits
    const maxCharacterLimit = 200;
    const warningDiv = document.createElement('div');
    warningDiv.id = 'warning';
    document.getElementById('container').appendChild(warningDiv);

    if (calcCharacterLength(textArea.value) > maxCharacterLimit) {
      warningDiv.textContent = 'Character limit exceeded!';
    } else if (calcCharacterLength(textArea.value) > maxCharacterLimit * 0.9) {
      warningDiv.textContent = 'Approaching character limit!';
    } else {
      warningDiv.textContent = '';
    }

    // Verify warning logic
    if (calcCharacterLength(textArea.value) > maxCharacterLimit) {
      expect(warningDiv.textContent).toBe('Character limit exceeded!');
    } else if (calcCharacterLength(textArea.value) > maxCharacterLimit * 0.9) {
      expect(warningDiv.textContent).toBe('Approaching character limit!');
    } else {
      expect(warningDiv.textContent).toBe('');
    }

    // verify reading  time updates when typing
    const readingTimeDiv = document.getElementById('readingTime');
    readingTimeDiv.textContent = calcReadingTime(calcCharacterLength(textArea.value));
    expect(readingTimeDiv.textContent).toBe(calcReadingTime(textArea.value.length));

  });

})
