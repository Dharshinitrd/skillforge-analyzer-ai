import { useRef, useState } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const LANGUAGES = [
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "javascript", label: "JS" },
];

const TRACE_STEPS = [
  "reading source",
  "running static checks",
  "reasoning about root cause",
  "drafting fix",
];

const SAMPLE = `def average(nums):
    total = 0
    for n in nums:
        total += n
    return total / len(nums)

print(average([]))`;

export default function App() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(SAMPLE);
  const [loading, setLoading] = useState(false);
  const [traceIndex, setTraceIndex] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(null);
  const [copied, setCopied] = useState(false);
  const gutterRef = useRef(null);
  const taRef = useRef(null);

  const lineCount = code.split("\n").length;

  function syncScroll() {
    if (gutterRef.current && taRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
  }

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);
    setTraceIndex(0);
    const start = performance.now();

    const tick = setInterval(() => {
      setTraceIndex((i) => (i < TRACE_STEPS.length - 1 ? i + 1 : i));
    }, 550);

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
      setElapsed(((performance.now() - start) / 1000).toFixed(1));
    } catch (e) {
      setError(e.message);
    } finally {
      clearInterval(tick);
      setLoading(false);
      setTraceIndex(-1);
    }
  }

  function copyFix() {
    if (!result?.corrected_code) return;
    navigator.clipboard.writeText(result.corrected_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const ledState = loading ? "running" : error ? "error" : result ? (result.error_detected ? "found" : "clear") : "idle";

  return (
    <div className="console">
      <header className="console-header">
        <div className="wordmark">
          <span className="wordmark-text">DEBUG//AGENT</span>
        </div>
        <div className="led-array" aria-hidden="true">
          <Led label="PWR" active={true} color="teal" />
          <Led label="SIG" active={loading} color="amber" pulse={loading} />
          <Led label="ERR" active={ledState === "found" || ledState === "error"} color="red" />
        </div>
        <span className="header-tag">root-cause analysis · 4 languages</span>
      </header>

      <main className="deck">
        <section className="unit input-unit">
          <div className="unit-bar">
            <div className="lang-toggle" role="tablist" aria-label="Language">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  role="tab"
                  aria-selected={language === l.id}
                  className={"lang-pill" + (language === l.id ? " active" : "")}
                  onClick={() => setLanguage(l.id)}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button className="run-btn" onClick={handleAnalyze} disabled={loading || !code.trim()}>
              <span className="run-btn-dot" />
              {loading ? "Analyzing" : "Analyze"}
            </button>
          </div>

          <div className="editor-frame">
            <div className="editor-gutter" ref={gutterRef}>
              {Array.from({ length: Math.max(lineCount, 24) }, (_, i) => (
                <div key={i} className="gutter-line">{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={taRef}
              className="editor-input"
              spellCheck={false}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={syncScroll}
              placeholder="Paste code to debug…"
            />
            {loading && <div className="scan-beam" />}
          </div>

          {loading && (
            <ul className="readout">
              {TRACE_STEPS.map((step, i) => (
                <li key={step} className={i < traceIndex ? "done" : i === traceIndex ? "active" : "pending"}>
                  <span className="readout-bracket">[{i < traceIndex ? "x" : i === traceIndex ? "~" : " "}]</span>
                  {step}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="unit output-unit">
          {!result && !error && !loading && (
            <div className="empty-state">
              <div className="empty-glyph">⌁</div>
              <p>Standing by. Run an analysis to see the diagnosis here —
              root cause, a fix, and next steps.</p>
            </div>
          )}

          {error && (
            <div className="fault-banner">
              <span className="fault-label">ANALYSIS FAULT</span>
              {error}
            </div>
          )}

          {result && (
            <div className="result">
              <div className={`verdict verdict-${result.error_detected ? "bad" : "good"}`}>
                <span className="verdict-dot" />
                <span className="verdict-text">
                  {result.error_detected ? (result.error_type || "Error") + " detected" : "No error detected"}
                </span>
                {elapsed && <span className="verdict-time">{elapsed}s</span>}
              </div>

              {result.explanation && (
                <Card label="Explanation" accent="amber">
                  <p>{result.explanation}</p>
                </Card>
              )}

              {result.root_cause && (
                <Card label="Root cause" accent="red">
                  <p>{result.root_cause}</p>
                </Card>
              )}

              {result.corrected_code && (
                <Card label="Corrected code" accent="teal"
                  action={
                    <button className="copy-btn" onClick={copyFix}>
                      {copied ? "copied" : "copy"}
                    </button>
                  }>
                  <pre className="code-block">{result.corrected_code}</pre>
                </Card>
              )}

              {result.debug_steps?.length > 0 && (
                <Card label="Debugging steps" accent="amber">
                  <ol className="step-list">
                    {result.debug_steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </Card>
              )}

              {result.best_practices?.length > 0 && (
                <Card label="Best practices" accent="teal">
                  <ul className="practice-list">
                    {result.best_practices.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </Card>
              )}

              {result.static_analysis_raw && (
                <Card label="Static analysis output" accent="dim">
                  <pre className="code-block dim">{result.static_analysis_raw}</pre>
                </Card>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Led({ label, active, color, pulse }) {
  return (
    <div className="led">
      <span className={`led-dot led-${color}${active ? " on" : ""}${pulse ? " pulse" : ""}`} />
      <span className="led-label">{label}</span>
    </div>
  );
}

function Card({ label, accent, children, action }) {
  return (
    <div className={`card card-${accent}`}>
      <div className="card-head">
        <h3>{label}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}