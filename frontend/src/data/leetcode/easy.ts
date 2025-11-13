import type { QuestionType } from "../../pages/leetcode/leetcode";

export const easyQuestions: QuestionType[] = [
    {
        id: 121,
        title: "Best Time to Buy and Sell Stock",
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        tags: ["Array", "Dynamic Programming"],
        difficulty: "Easy",
        solutions: {
        },
    },
    {
        id: 250,
        title: "easy1",
        link: "somelink",
        tags: ["maths", "implementation"],
        difficulty: "Easy",
        solutions: {
            Rust: `fn main() {
    // The println! macro prints to the console with a newline (like cout << ... << endl)
    println!("something"); 
}`,
            cpp: `#include <iostream> // Include the input/output stream library, which is necessary for console I/O (like cout).

using namespace std; // Use the standard namespace to avoid writing std:: before cout, endl, etc.

int main () { // The main function, where program execution begins.
	cout << "something" << endl; // Print the string "something" to the console, and \\`,
        },
    },
];