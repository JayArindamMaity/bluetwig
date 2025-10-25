import React, { useState } from "react";
import "./leftbar.css";
import type { QuestionType } from "../../pages/leetcode/leetcode";

interface LeftbarProps {
  questions: QuestionType[];
  onSelectDifficulty: React.Dispatch<React.SetStateAction<string | null>>;
  onSelectQuestion: (id: number) => void;
}

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

const Leftbar: React.FC<LeftbarProps> = ({
  questions,
  onSelectDifficulty,
  onSelectQuestion,
}) => {
  const [search, setSearch] = useState("");

  // Filter logic: matches both difficulty and question name
  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="leftbar">
      <div className="leftbar-filters">
        <h3>Filter by Difficulty 📊</h3>
        <div className="difficulty-buttons">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => onSelectDifficulty(diff)}
              className="difficulty-btn"
            >
              {diff}
            </button>
          ))}
          <button
            onClick={() => onSelectDifficulty(null)}
            className="difficulty-btn"
          >
            All
          </button>
        </div>

        {/* New search input */}
        <div className="leftbar-search">
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="leftbar-questions">
        <h3>Questions 📝</h3>
        <ul className="question-list">
          {filteredQuestions.length === 0 ? (
            <p className="no-results">No problems found</p>
          ) : (
            filteredQuestions.map((q) => (
              <li
                key={q.id}
                onClick={() => onSelectQuestion(q.id)}
                className="question-item"
              >
                {q.title}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Leftbar;
