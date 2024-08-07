const args = process.argv.slice(2)

var reversed = ""
let string = args[0]
let length = args[0].length-1
for (i in args[0]){
    reversed = reversed + string[length]
    length = length - 1
}

console.log(reversed)