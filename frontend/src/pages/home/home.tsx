import './home.css';

export default function Home() {
    return (
        <div className="home-container main-content">
            <h1 className="title">
                Welcome to <span className="highlight">Blue Twig</span>
            </h1>
            <p className="subtitle">
                A fast-track resource for mastering Data Structures & Algorithms — the smart way.
            </p>

            <div className="intro-section">
                <p>
                    Here’s the deal: you don’t learn DSA by memorizing solutions. You learn by 
                    wrestling with problems — breaking your brain a little, then putting it back 
                    together stronger. That’s where RabbitCode comes in.
                </p>
                <p>
                    Try the problems first on platforms like <span className="platform">LeetCode</span>, 
                    <span className="platform"> Codeforces</span>, or <span className="platform"> CodeChef</span>.  
                    Once you’ve given it a shot, hop back here to see clean, optimized solutions and 
                    understand *why* they work. No spoon-feeding — just straight insight.
                </p>
            </div>

            <div className="learn-section">
                <h2>How to Learn Faster</h2>
                <ul>
                    <li>Don’t just read code — trace it line by line until you feel the logic click.</li>
                    <li>Reimplement solutions in your own style. Rename variables. Add your twist.</li>
                    <li>Time yourself. Coding under a clock teaches efficiency and focus.</li>
                    <li>After solving, refactor. Clean code = clear thinking.</li>
                </ul>
            </div>

            <div className="code-mindset">
                <h2>Code Like a Builder</h2>
                <p>
                    DSA isn’t about passing tests — it’s about building intuition. Each problem 
                    you solve is a brick. Stack them right and you’ll have the foundation for 
                    any complex project you dream up.
                </p>
                <p>
                    So go ahead — get your hands dirty. The answers are here, but they’re not the point.
                    The point is the journey from confusion to clarity.
                </p>
            </div>
{/* 
            <div className="cta">
                <a href="/problems" className="cta-button">Start Practicing →</a>
            </div> */}
        </div>
    );
}
