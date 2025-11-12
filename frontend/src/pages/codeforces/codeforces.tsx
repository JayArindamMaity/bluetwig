import React, { useEffect, useState } from "react";
import "../../pages/codeforces/codeforces.css";
import CFLeftbar from "../../components/cfleft/cfleft";
import { eightHundredQuestions } from "../../data/codeforces/800";
import { nineHundredQuestions } from "../../data/codeforces/900";
import { thousandQuestions } from "../../data/codeforces/1000";
import './codeforces.css'

export interface CFQuestionType {
  id: number;
  title: string;
  link: string;
  tags: string[];
  rating: number;
  solutions: Record<string, string>;
}

const Codeforces: React.FC = () => {
  const allQuestions: CFQuestionType[] = [
    ...eightHundredQuestions,
    ...nineHundredQuestions,
    ...thousandQuestions,
  ].sort((a, b) => a.id - b.id);

  const [questions, setQuestions] = useState<CFQuestionType[]>(allQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<CFQuestionType | null>(null);
  const [maxRating, setMaxRating] = useState<number>(800);

  useEffect(() => {
    const filtered = allQuestions.filter(q => q.rating <= maxRating);
    setQuestions(filtered);
  }, [maxRating]);

  return (
    <div className="codeforces-container">
      <CFLeftbar
        questions={questions}
        onSelectQuestion={(id) =>
          setSelectedQuestion(questions.find((q) => q.id === id) || null)
        }
        selectedId={selectedQuestion?.id || null}
        maxRating={maxRating}
        setMaxRating={setMaxRating}
      />

      <div className="codeforces-main">
        {!selectedQuestion ? (
          <div className="codeforces-greeting">
            <h2>Welcome to the BlueTwig's Codeforces solutions section.</h2>
            <p>Use the slider in the sidebar to filter problems by rating, and pick one to view multi-language solutions.</p>
          </div>
        ) : (
          <div className="codeforces-question">
            <h1>{selectedQuestion.title}</h1>
            <a href={selectedQuestion.link} target="_blank" rel="noopener noreferrer">
              View on Codeforces
            </a>
            <div className="codeforces-tags">
              {selectedQuestion.tags.map((tag) => (
                <span key={tag} className="codeforces-tag">{tag}</span>
              ))}
            </div>
            <p className="codeforces-rating">Rating: {selectedQuestion.rating}</p>

            {Object.entries(selectedQuestion.solutions).map(([lang, code]) => (
              <div key={lang}>
                <h3>{lang}</h3>
                <div className="codeforces-codebox">
                  <button
                    className="copy-btn"
                    onClick={() => navigator.clipboard.writeText(code)}
                  >
                    Copy
                  </button>
                  <pre><code>{code}</code></pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Codeforces;