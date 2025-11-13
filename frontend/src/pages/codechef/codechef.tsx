import React, { useEffect, useState } from "react";
import "../../pages/codechef/codechef.css";
import CFLeftbar from "../../components/cfleft/cfleft";
import { eightHundredQuestions } from "../../data/codechef/800";
import './codechef.css';

// 1. Import Syntax Highlighter
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// 2. Choose your theme. 
// I've left Gruvbox here for you to uncomment if you prefer that over VS Code Dark.
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  
  // State for copy feedback
  const [copiedState, setCopiedState] = useState<string | null>(null);

  useEffect(() => {
    const filtered = allQuestions.filter(q => q.rating <= maxRating);
    setQuestions(filtered);
  }, [maxRating]);

  const handleCopy = (code: string, lang: string) => {
    navigator.clipboard.writeText(code);
    setCopiedState(lang);
    setTimeout(() => setCopiedState(null), 2000);
  };

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
              View on CodeChef 
            </a>
            <div className="codechef-tags">
              {selectedQuestion.tags.map((tag) => (
                <span key={tag} className="codechef-tag">{tag}</span>
              ))}
            </div>
            <p className="codechef-rating">Rating: {selectedQuestion.rating}</p>

            {Object.entries(selectedQuestion.solutions).map(([lang, code]) => (
              <div key={lang} style={{ marginBottom: "20px" }}>
                <h3 style={{ textTransform: 'capitalize' }}>{lang}</h3>
                
                {/* Codebox with relative positioning */}
                <div className="codechef-codebox" style={{ position: "relative" }}>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(code, lang)}
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
                  
                  <SyntaxHighlighter
                    language={lang.toLowerCase() === 'c++' ? 'cpp' : lang.toLowerCase()}
                    style={vscDarkPlus}
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

export default CodeChef;