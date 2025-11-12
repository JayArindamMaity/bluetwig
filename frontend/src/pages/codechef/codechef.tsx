import React, { useEffect, useState } from "react";
import "../../pages/codechef/codechef.css";
import CFLeftbar from "../../components/cfleft/cfleft";
import { eightHundredQuestions } from "../../data/codechef/800";
import './codechef.css'

export interface CFQuestionType {
  id: number;
  title: string;
  link: string;
  tags: string[];
  rating: number;
  solutions: Record<string, string>;
}

const CodeChef: React.FC = () => {
  const allQuestions: CFQuestionType[] = [
    ...eightHundredQuestions,
    // ...nineHundredQuestions,
    // ...thousandQuestions,
  ].sort((a, b) => a.id - b.id);

  const [questions, setQuestions] = useState<CFQuestionType[]>(allQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<CFQuestionType | null>(null);
  const [maxRating, setMaxRating] = useState<number>(800);

  useEffect(() => {
    const filtered = allQuestions.filter(q => q.rating <= maxRating);
    setQuestions(filtered);
  }, [maxRating]);

  return (
    <div className="codechef-container">
      <CFLeftbar
        questions={questions}
        onSelectQuestion={(id) =>
          setSelectedQuestion(questions.find((q) => q.id === id) || null)
        }
        selectedId={selectedQuestion?.id || null}
        maxRating={maxRating}
        setMaxRating={setMaxRating}
      />

      <div className="codechef-main">
        {!selectedQuestion ? (
          <div className="codechef-greeting">
            <h2>Welcome to the BlueTwig's CodeChef solutions section.</h2>
            <p>Use the slider in the sidebar to filter problems by rating, and pick one to view multi-language solutions.</p>
          </div>
        ) : (
          <div className="codechef-question">
            <h1>{selectedQuestion.title}</h1>
            <a href={selectedQuestion.link} target="_blank" rel="noopener noreferrer">
              View on Codeforces
            </a>
            <div className="codechef-tags">
              {selectedQuestion.tags.map((tag) => (
                <span key={tag} className="codechef-tag">{tag}</span>
              ))}
            </div>
            <p className="codechef-rating">Rating: {selectedQuestion.rating}</p>

            {Object.entries(selectedQuestion.solutions).map(([lang, code]) => (
              <div key={lang}>
                <h3>{lang}</h3>
                <div className="codechef-codebox">
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

export default CodeChef;