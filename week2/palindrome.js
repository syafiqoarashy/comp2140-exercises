const originalWord = "racecar";
let reversedWord = "";

for (let i = originalWord.length - 1; i >= 0; i--) {
    reversedWord += originalWord[i]
}

if (originalWord == reversedWord) {
    console.log(`${originalWord} is a palindrome.`)
}
else
{
    console.log(`${originalWord} is not a palindrome.`)
}
        