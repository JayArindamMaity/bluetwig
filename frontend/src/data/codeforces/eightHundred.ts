import type { CFQuestionType } from "../../pages/codeforces/codeforces";

export const eightHundredQuestions: CFQuestionType[] = [
  {
      id: 1,
      title: "Way Too Long Words",
      link: "https://codeforces.com/problemset/problem/71/A",
      tags: ["Strings", "Implementation"],
      rating: 800,
      solutions: {
          C: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    while (n--) {
        char s[101];
        scanf("%s", s);
        int len = strlen(s);
        if (len > 10)
            printf("%c%d%c\\n", s[0], len - 2, s[len - 1]);
        else
            printf("%s\\n", s);
    }
    return 0;
}`,
          Python: `for _ in range(int(input())):
    s = input()
    print(s if len(s) <= 10 else f"{s[0]}{len(s)-2}{s[-1]}")`,
      },
  },
  {
      id: 2,
      title: "Theatre Square",
      link: "https://codeforces.com/problemset/problem/1/A",
      tags: ["Math", "Implementation"],
      rating: 800,
      solutions: {
          Python: `n, m, a = map(int, input().split())
print(-(-n//a) * -(-m//a))`,
      },
  },
];
