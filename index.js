function calcCharacterLength(textInput){
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

function calcReadingTime(charCount) {
  return charCount=== 0 ? '0 minutes': `${Math.ceil(charCount / 200)} minutes`;
}

module.exports = {
  calcCharacterLength,
  countWords,
  calcSentenceCount,
  calcReadingTime
}