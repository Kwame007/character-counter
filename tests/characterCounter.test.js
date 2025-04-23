function calcStringLength(textInput){
if (!textInput) {
  return 0;
}

return textInput.length
}

function countWords(str) {
  let words = str.match(/\b\w+\b/g);
  return words ? words.length : 0;
}

function calcSentenceCount(textInput){
  // check if empty string
  if (!textInput) {
  return 0;
}
return textInput.split(/[.!?]/).length - 1
}


describe('calcSentenceCount', () => {
  test('should return 0 for an empty string', () => {
    expect(calcSentenceCount('')).toBe(0);
  });

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

  test('should return the correct sentence count for a string with trailing punctuation', () => {
    expect(calcSentenceCount('Hello world. How are you? ')).toBe(2);
  });

  // test('should return the correct sentence count for a string with only punctuation', () => {
  //   expect(calcSentenceCount('...!!!???')).toBe(0);
  // });

  test('should return the correct sentence count for a string with newline characters', () => {
    expect(calcSentenceCount('Hello world.\nHow are you?')).toBe(2);
  });

  test('should return the correct sentence count for a string with tabs', () => {
    expect(calcSentenceCount('Hello world.\tHow are you?')).toBe(2);
  });

  test('should return the correct sentence count for a string with multiple spaces between sentences', () => {
    expect(calcSentenceCount('Hello world.   How are you?')).toBe(2);
  });

  test('should return the correct sentence count for a string with numbers and punctuation', () => {
    expect(calcSentenceCount('The year is 2023. What is next?')).toBe(2);
  });
});

describe('countWords', () => {
  test('should return 0 for an empty string', () => {
    expect(countWords('')).toBe(0);
  });


  test('should return the correct word count for a string with regular words', () => {
    expect(countWords('hello world')).toBe(2);
  });

  test('should return the correct word count for a string with extra spaces', () => {
    expect(countWords('  hello   world  ')).toBe(2);
  });

  test('should return the correct word count for a string with special characters', () => {
    expect(countWords('hello, world!')).toBe(2);
  });

  test('should return the correct word count for a string with numbers', () => {
    expect(countWords('123 456')).toBe(2);
  });

  test('should return the correct word count for a string with mixed characters', () => {
    expect(countWords('hello123 world456')).toBe(2);
  });

  test('should return the correct word count for a string with only spaces', () => {
    expect(countWords('     ')).toBe(0);
  });

  test('should return the correct word count for a string with newline characters', () => {
    expect(countWords('hello\nworld')).toBe(2);
  });

  test('should return the correct word count for a string with tabs', () => {
    expect(countWords('hello\tworld')).toBe(2);
  });

  test('should return the correct word count for a string with punctuation and symbols', () => {
    expect(countWords('hello-world!')).toBe(2);
  });

  test('should return the correct word count for a single word', () => {
    expect(countWords('hello')).toBe(1);
  });
});

describe('calcStringLength', () => {
  test('should return 0 for an empty string', () => {
    expect(calcStringLength('')).toBe(0);
  });

  test('should return the correct length for a string with regular characters', () => {
    expect(calcStringLength('hello')).toBe(5);
  });

  test('should return the correct length for a string with spaces', () => {
    expect(calcStringLength('hello world')).toBe(11);
  });

  test('should return the correct length for a string with special characters', () => {
    expect(calcStringLength('!@#$%^&*()')).toBe(10);
  });

  test('should return the correct length for a string with only spaces', () => {
    expect(calcStringLength('     ')).toBe(5);
  });
});

