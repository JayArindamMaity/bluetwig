import React, { useEffect, useState } from "react";
import "../../pages/leetcode/leetcode.css";
import Leftbar from "../../components/leftbar/leftbar";

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

  const normalizeDifficulty = (d: string): "Easy" | "Medium" | "Hard" => {
    switch (d.toLowerCase()) {
      case "easy":
        return "Easy";
      case "medium":
        return "Medium";
      case "hard":
        return "Hard";
      default:
        throw new Error("Invalid difficulty: " + d);
    }
  };

  const loadQuestions = async (difficulty: string | null) => {
    const importData = async (level: string) => {
      const imported = await import(`../../../public/data/leetcode/${level}`);
      const key = `${level}Questions`;
      return imported[key].map((q: any) => ({
        ...q,
        difficulty: normalizeDifficulty(q.difficulty),
      }));
    };

    let data: QuestionType[] = [];
    if (difficulty) {
      data = await importData(difficulty.toLowerCase());
    } else {
      const easy = await importData("easy");
      const medium = await importData("medium");
      const hard = await importData("hard");
      data = [...easy, ...medium, ...hard].sort((a, b) => a.id - b.id);
    }

    setQuestions(data);
  };

  useEffect(() => {
    loadQuestions(selectedDifficulty);
  }, [selectedDifficulty]);

  return (
    <div className="leetcode-container">
      <Leftbar
        questions={questions}
        onSelectDifficulty={setSelectedDifficulty}
        onSelectQuestion={(id) => setSelectedQuestion(questions.find((q) => q.id === id) || null)}
      />
      <div className="leetcode-main">
        {!selectedQuestion ? (
          <div className="leetcode-greeting">
            <h2>Welcome to the LeetCode Solutions Hub 🚀</h2>
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
              <div key={lang}>
                <h3>{lang}</h3>
                <div className="leetcode-codebox">
                  <button className="copy-btn" onClick={() => navigator.clipboard.writeText(code)}>
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

export default Leetcode;
