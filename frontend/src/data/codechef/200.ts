// This file contains codechef 200 questions

export const two_hundred = [
  {
    quesname: "Time Penalty",
    queslink: "https://www.codechef.com/problems/WAPEN",
    soljava: `import java.util.*;
import java.lang.*;
import java.io.*;

class Codechef
{
	public static void main (String[] args) throws java.lang.Exception
	{
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b*10);
	}
}`,
    expjava: `*   Read two integer values from the standard input.
*   The second integer is multiplied by a constant factor of 10.
*   The first integer is then added to the result of the multiplication.
*   The final sum is printed to the standard output.`,
    solcpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
	// your code goes here
	int a{0} , b{0};
	cin >> a >> b;
	cout << a + b*10 << endl;
    return 0;
}`,
    expcpp: `*   Declare two integer variables.
*   Read two integer values from the standard input stream.
*   Calculate a new value by multiplying the second input by ten and then adding the first input to that product.
*   Print the final result to the standard output stream, followed by a newline.`,
    solpyth: `a, b = map(int, input().split())
print(a + b * 10)`,
    exppyth: `this is a simple python code that takes input, splits it, converts it to integer and then prints it after performing required operations`,
    solrust: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let parts: Vec<i32> = input
        .split_whitespace()
        .map(|s| s.parse().unwrap())
        .collect();

    let a = parts[0];
    let b = parts[1];

    println!("{}", a + b * 10);
}`,
    exprust: `*   Reads a single line of text from the standard input.
*   Splits the input string into separate parts wherever a space is found.
*   Converts each of these parts from text into a whole number.
*   Gathers the resulting numbers into a collection.
*   Assigns the first number from the collection to one variable and the second number to another.
*   Computes a final value by multiplying the second number by ten and then adding the first number.
*   Prints the final computed value to the console.`,
  },
];

