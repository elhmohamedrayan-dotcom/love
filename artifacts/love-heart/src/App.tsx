import { useEffect, useState } from 'react';
import { Link, Route, Switch, Router as WouterRouter } from 'wouter';
import {
  createRandomHeartLayout,
  HEART_PATH,
  HEART_SIZE,
  type PhrasePlacement,
} from './lib/heart-layout';

function Welcome() {
  return (
    <main className="welcome-page">
      <div className="welcome-lockup">
        <h1>Welcome, Doua</h1>
        <Link href="/heart" className="enter-link" data-testid="link-enter-heart">
          Enter the heart <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}

function Heart() {
  const [layout, setLayout] = useState<PhrasePlacement[]>(() => createRandomHeartLayout());
  const [revealed, setRevealed] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [dedicationVisible, setDedicationVisible] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setRevealed(0);
    setDedicationVisible(false);
    let dedicationTimer: number | undefined;

    if (reducedMotion) {
      setRevealed(layout.length);
      dedicationTimer = window.setTimeout(() => setDedicationVisible(true), 220);
      return () => window.clearTimeout(dedicationTimer);
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setRevealed(index);
      if (index >= layout.length) {
        window.clearInterval(timer);
        dedicationTimer = window.setTimeout(() => setDedicationVisible(true), 350);
      }
    }, 20);

    return () => {
      window.clearInterval(timer);
      if (dedicationTimer !== undefined) window.clearTimeout(dedicationTimer);
    };
  }, [layout, replayKey]);

  const replay = () => {
    setLayout(createRandomHeartLayout());
    setRevealed(0);
    setDedicationVisible(false);
    setReplayKey((key) => key + 1);
  };

  return (
    <main className="heart-page">
      <svg
        className="heart-art"
        viewBox={`0 0 ${HEART_SIZE} ${HEART_SIZE}`}
        role="img"
        aria-labelledby="heart-title"
      >
        <title id="heart-title">A heart of love for Doua</title>
        <defs>
          <clipPath id="phrase-heart-clip">
            <path d={HEART_PATH} />
          </clipPath>
        </defs>
        <g clipPath="url(#phrase-heart-clip)" aria-hidden="true">
          {layout.map((placement, index) => (
            <text
              key={`${replayKey}-${placement.id}`}
              className={`heart-phrase ${placement.color === 'rose' ? 'phrase-rose' : 'phrase-blush'}${index < revealed ? ' is-visible' : ''}`}
              x={placement.x}
              y={placement.y}
              textAnchor="middle"
              textLength={placement.width}
              lengthAdjust="spacingAndGlyphs"
              dominantBaseline="middle"
              direction="auto"
              data-testid={`phrase-${placement.id}`}
            >
              {placement.text}
            </text>
          ))}
        </g>
        {dedicationVisible && (
          <text
            className="dedication"
            x="400"
            y="400"
            textAnchor="middle"
            dominantBaseline="middle"
            data-testid="text-dedication"
          >
            Doua
          </text>
        )}
      </svg>
      <p className="signature" data-testid="text-signature">By Rayan</p>
      <nav className="heart-nav" aria-label="Keepsake navigation">
        <button type="button" className="text-action" onClick={replay} data-testid="button-replay">
          Replay
        </button>
        <Link href="/" className="text-action" data-testid="link-home">Home</Link>
        <Link href="/next" className="text-action" data-testid="link-next">Next</Link>
      </nav>
    </main>
  );
}

function NextPage() {
  return (
    <main className="next-page">
      <Link href="/heart" className="back-link" data-testid="link-back-heart">
        <span aria-hidden="true">←</span> Back
      </Link>
    </main>
  );
}

function NotFound() {
  return (
    <main className="next-page">
      <Link href="/" className="back-link" data-testid="link-back-home">
        <span aria-hidden="true">←</span> Home
      </Link>
    </main>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Switch>
        <Route path="/" component={Welcome} />
        <Route path="/heart" component={Heart} />
        <Route path="/next" component={NextPage} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
