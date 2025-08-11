// This file contains leetcode easy questions

export const leetcode_easy = [
    {
        quesname: "Transpose Matrix",
        queslink: "https://leetcode.com/problems/transpose-matrix/description/",
        soljava: ``,
        solcpp: `class Solution {
 public:
  vector<vector<int>> transpose(vector<vector<int>>& A) {
    vector<vector<int>> ans(A[0].size(), vector<int>(A.size()));

    for (int i = 0; i < A.size(); ++i)
      for (int j = 0; j < A[0].size(); ++j)
        ans[j][i] = A[i][j];

    return ans;
  }
};`,
        solpyth: ``,
        solrust: ``
    },
];