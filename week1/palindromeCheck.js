const args = process.argv.slice(2)

let string = args[0]
let length = args[0].length-1
let check = false
for (i in string)
{
    if (string[i] == string[length])
    {
        check = true
        length = length - 1
    }
    else
    {
        check = false
        console.log("This is not a palindrome!")
        break
    }
}

if (check == true)
    console.log("This is a palindrome!")
