import type { CFQuestionType } from "../../pages/codeforces/codeforces";

export const thousandQuestions: CFQuestionType[] = [
  {
      id: 5,
      title: "Team",
      link: "https://codeforces.com/problemset/problem/231/A",
      tags: ["Brute Force"],
      rating: 1000,
      solutions: {
          Python: `n = int(input())
print(sum(sum(map(int, input().split())) >= 2 for _ in range(n)))`,
      },
  },
  {
      id: 6,
      title: "Next Round",
      link: "https://codeforces.com/problemset/problem/158/A",
      tags: ["Implementation", "Sorting"],
      rating: 1000,
      solutions: {
          Python: `n, k = map(int, input().split())
scores = list(map(int, input().split()))
threshold = scores[k-1]
print(sum(score >= threshold and score > 0 for score in scores))`,
      },
  },
];
