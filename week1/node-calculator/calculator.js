// Get command line arguments
const args = process.argv.slice(2);

// Check if we have the correct number of arguments
if (args.length !== 3) {
    console.log('Usage: node calculator.js [number1] [operator] [number2]');
    process.exit(1);
}

// Parse arguments
const num1 = parseFloat(args[0]);
const operator = args[1];
const num2 = parseFloat(args[2]);

// Perform calculation
let result;
switch (operator) {
    case '+':
        result = num1 + num2;
        break;
    case '-':
        result = num1 - num2;
        break;
    case '*':
        result = num1 * num2;
        break;
    case '/':
        if (num2 === 0) {
            console.log('Error: Division by zero');
            process.exit(1);
        }
        result = num1 / num2;
        break;
    default:
        console.log('Error: Invalid operator');
        process.exit(1);
}

// Output result
console.log(`${num1} ${operator} ${num2} = ${result}`);