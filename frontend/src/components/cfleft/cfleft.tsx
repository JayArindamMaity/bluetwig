import React, { useState } from "react";
import "./cfleft.css";
import type { CFQuestionType } from "../../pages/codeforces/codeforces";

interface CFLeftbarProps {
  questions: CFQuestionType[];
  onSelectQuestion: (id: number) => void;
  selectedId?: number | null;
  maxRating: number;
  setMaxRating: (val: number) => void;
}

const CFLeftbar: React.FC<CFLeftbarProps> = ({
  questions,
  onSelectQuestion,
  selectedId,
  maxRating,
  setMaxRating
}) => {
  const [search, setSearch] = useState("");

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) &&
      q.rating === maxRating // only exact rating matches
  );

  return (
    <div className="cf-leftbar">
      <div className="cf-leftbar-header">
        <h2>Problems</h2>
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="cf-slider">
          <label>Rating: {maxRating}</label>
          <input
            type="range"
            min="100"
            max="3500"
            step="100"
            value={maxRating}
            onChange={(e) => setMaxRating(Number(e.target.value))}
            className="slider-accent"
          />
        </div>
      </div>

      <div className="cf-leftbar-list">
        {filteredQuestions.length === 0 ? (
          <p className="cf-no-results">No problems found</p>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className={`cf-question-item ${
                selectedId === q.id ? "active" : ""
              }`}
              onClick={() => onSelectQuestion(q.id)}
            >
              <span className="cf-question-title">{q.title}</span>
              <span className="cf-question-rating">{q.rating}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CFLeftbar;
