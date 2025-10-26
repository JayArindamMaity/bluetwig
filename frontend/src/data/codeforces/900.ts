import type { CFQuestionType } from "../../pages/codeforces/codeforces";

export const nineHundredQuestions: CFQuestionType[] = [
  {
      id: 3,
      title: "Beautiful Matrix",
      link: "https://codeforces.com/problemset/problem/263/A",
      tags: ["Implementation"],
      rating: 900,
      solutions: {
          Python: `for i in range(5):
    row = list(map(int, input().split()))
    if 1 in row:
        print(abs(2 - i) + abs(2 - row.index(1)))`,
      },
  },
  {
      id: 4,
      title: "Bit++",
      link: "https://codeforces.com/problemset/problem/282/A",
      tags: ["Implementation"],
      rating: 900,
      solutions: {
          Cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, x = 0;
    cin >> n;
    while (n--) {
        string s;
        cin >> s;
        if (s.find("++") != string::npos) x++;
        else x--;
    }
    cout << x;
}`,
      },
  },
];
