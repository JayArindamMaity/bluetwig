import type { QuestionType } from "../../../src/pages/leetcode/leetcode";

export const easyQuestions: QuestionType[] = [
  {
    id: 121,
    title: "Best Time to Buy and Sell Stock",
    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    tags: ["Array", "Dynamic Programming"],
    difficulty: "Easy",
    solutions: {
      C: `int maxProfit(int* prices, int pricesSize) {...}`,
      "C++": `class Solution {...}`,
      Java: `class Solution {...}`,
      Python: `class Solution: ...`,
      Rust: `impl Solution {...}`,
    },
  },
  {
    id: 1,
    title: "Two Sum",
    link: "https://leetcode.com/problems/two-sum/",
    tags: ["Array", "Hash Map"],
    difficulty: "Easy",
    solutions: {
      C: "C solution...",
      "C++": "C++ solution...",
      Java: "Java solution...",
      Python: "Python solution...",
      Rust: "Rust solution...",
    },
  },
];
