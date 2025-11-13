import React, { useEffect, useState } from "react";
import "../../pages/leetcode/leetcode.css";
import Leftbar from "../../components/leftbar/leftbar";
import { easyQuestions } from "../../data/leetcode/easy";
import { mediumQuestions } from "../../data/leetcode/medium";
import { hardQuestions } from "../../data/leetcode/hard";

// 1. Import Syntax Highlighter and a Theme
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Change this line in your imports
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface QuestionType {
  id: number;
  title: string;
  link: string;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  solutions: Record<string, string>;
}

const Leetcode: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [copiedState, setCopiedState] = useState<string | null>(null); // Optional: For copy feedback

  const loadQuestions = (difficulty: string | null) => {
    let data: QuestionType[] = [];

    if (difficulty) {
      switch (difficulty.toLowerCase()) {
        case "easy":
          data = easyQuestions;
          break;
        case "medium":
          data = mediumQuestions;
          break;
        case "hard":
          data = hardQuestions;
          break;
        default:
          throw new Error("Invalid difficulty: " + difficulty);
      }
    } else {
      data = [...easyQuestions, ...mediumQuestions, ...hardQuestions].sort(
        (a, b) => a.id - b.id
      );
    }
    setQuestions(data);
  };

  useEffect(() => {
    loadQuestions(selectedDifficulty);
  }, [selectedDifficulty]);

  const handleCopy = (code: string, lang: string) => {
    navigator.clipboard.writeText(code);
    setCopiedState(lang);
    setTimeout(() => setCopiedState(null), 2000);
  };

  return (
    <div className="leetcode-container">
      <Leftbar
        questions={questions}
        onSelectDifficulty={setSelectedDifficulty}
        onSelectQuestion={(id) =>
          setSelectedQuestion(questions.find((q) => q.id === id) || null)
        }
      />
      <div className="leetcode-main">
        {!selectedQuestion ? (
          <div className="leetcode-greeting">
            <h2>Welcome to BlueTwig's Leetcode solutions section.</h2>
            <p>Select a problem from the sidebar to view solutions in multiple languages.</p>
          </div>
        ) : (
          <div className="leetcode-question">
            <h1>{selectedQuestion.title}</h1>
            <a href={selectedQuestion.link} target="_blank" rel="noopener noreferrer">
              View on LeetCode
            </a>
            <div className="leetcode-tags">
              {selectedQuestion.tags.map((tag) => (
                <span key={tag} className="leetcode-tag">{tag}</span>
              ))}
            </div>
            <p className="leetcode-diff">{selectedQuestion.difficulty}</p>

            {Object.entries(selectedQuestion.solutions).map(([lang, code]) => (
              <div key={lang} style={{ marginBottom: "20px" }}>
                <h3 style={{ textTransform: 'capitalize' }}>{lang}</h3>
                
                {/* Codebox Container */}
                <div className="leetcode-codebox" style={{ position: "relative" }}>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(code, lang)}
                    // Inline styles ensure button floats over the code
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      zIndex: 5,
                      padding: "5px 10px",
                      cursor: "pointer"
                    }}
                  >
                    {copiedState === lang ? "Copied!" : "Copy"}
                  </button>

                  {/* Syntax Highlighter Component */}
                  <SyntaxHighlighter
                    language={lang.toLowerCase() === 'c++' ? 'cpp' : lang.toLowerCase()}
                    style={gruvboxDark}
                    customStyle={{
                      borderRadius: "8px",
                      padding: "20px",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                    showLineNumbers={true}
                    wrapLongLines={true}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leetcode;