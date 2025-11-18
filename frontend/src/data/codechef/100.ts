import type { CFQuestionType } from "../../pages/codechef/codechef";

export const oneHundredQuestions: CFQuestionType[] = [
    {
        id: 1,
        title: "Time Penalty",
        link: "https://www.codechef.com/problems/WAPEN",
        tags: ["Math"],
        rating: 100,
        solutions: {
            Cpp: `#include <bits/stdc++.h> // Includes all standard C++ libraries, a common practice in competitive programming.
using namespace std; // Allows the use of standard library components without the std:: prefix.

int main() { // The main function where program execution begins.
	// your code goes here
	int a{0} , b{0}; // Declare and initialize two integer variables, 'a' and 'b', to zero.
	cin >> a >> b; // Read two integer values from standard input and store them in 'a' and 'b'.
	cout << a + b*10 << endl; // Calculate the result of a + (b * 10) and print it to the console, followed by a newline.
    return 0; // Indicates that the program executed successfully.
}`,
            Rust: `use std::io; // Import the standard library's input/output module.

fn main() { // The main function, where the program execution begins.
    let mut input = String::new(); // Create a new, mutable String to hold user input.
    io::stdin().read_line(&mut input).unwrap(); // Read a single line from standard input into the \`input\` string.

    // Parse the input string into a vector of integers.
    let parts: Vec<i32> = input
        .split_whitespace() // Split the string by whitespace into an iterator.
        .map(|s| s.parse().unwrap()) // Convert each part into an i32, panicking if it fails.
        .collect(); // Collect the results into a vector.

    let a = parts[0]; // Assign the first number from the input to variable 'a'.
    let b = parts[1]; // Assign the second number from the input to variable 'b'.

    println!("{}", a + b * 10); // Calculate the result of the expression and print it to the console.
}`,
        },
    },
];