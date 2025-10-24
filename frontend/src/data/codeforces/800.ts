// This file contains codeforces 800 questions

export const eight_hundred = [
  {
    quesname: "1742A",
    queslink: "https://codeforces.com/contest/1742/problem/A",
    soljava: ``,
    expjava: ``,
    solcpp: `#include <iostream>

using namespace std;

int main () {
    int T;
    cin >> T;
    while (T--) {
        int a , b , c;
        cin >> a >> b >> c;
        if (a + b == c) {
            cout << "Yes" << endl;
        }
        else if (b + c == a) {
            cout << "Yes" << endl;
        }
        else if (c + a == b) {
            cout << "Yes" << endl;
        }
        else {
            cout << "No" << endl;
        }
    }

    return 0;
}`,
    expcpp: `*   The program is designed to handle multiple independent test cases.
*   For each test case, it reads three numbers as input.
*   It then checks if any two of the numbers sum up to the third number.
*   This involves checking all three possible pairings: the first and second, the second and third, and the first and third.
*   If any of these pairs sum to the remaining number, a positive result is printed.
*   If none of the pairs satisfy the condition, a negative result is printed.`,
    solpyth: ``,
    exppyth: ``,
    solrust: ``,
    exprust: ``,
  },
];

