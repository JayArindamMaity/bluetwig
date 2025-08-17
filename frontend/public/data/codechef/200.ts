// This file contains codechef 200 questions

export const two_hundred = [
    {
        quesname: "Chef and Parole",
        queslink: "https://www.codechef.com/problems/CHEFPAROLE",
        soljava: `import java.util.*;
import java.lang.*;
import java.io.*;

class Codechef
{
	public static void main (String[] args) throws java.lang.Exception
	{
		// your code goes here
        Scanner sc = new Scanner(System.in);
        
        int a = sc.nextInt();
        if (a >= 7) {
            System.out.println("Yes");
        }
        else {
            System.out.println("No");
        }
	}
}`,
        solcpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
	// your code goes here
    int a;
    cin >> a;
    if (a >= 7) {
        cout << "yes" << endl;
    }
    else {
        cout << "no" << endl;
    }
    return 0;
}`,
        solpyth: `a = int(input())

if a >= 7:
    print("Yes")
else:
    print("No")`,
        solrust: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let a: i32 = input.trim().parse().unwrap();

    if a >= 7 {
        println!("Yes");
    } else {
        println!("No");
    }
}`
    },
];
