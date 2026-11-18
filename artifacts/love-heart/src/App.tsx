import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Pause, Play, RotateCcw } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const phrases = [
  { text: 'I love you', language: 'English' },
  { text: "Je t'aime", language: 'Français' },
  { text: 'Te amo', language: 'Español' },
  { text: 'Ich liebe dich', language: 'Deutsch' },
  { text: 'الخ (أحبك)', language: 'العربية' },
  { text: '사랑해', language: '한국어' },
  { text: 'Я тебя люблю', language: 'Русский' },
  { text: 'Aku cinta kamu', language: 'Bahasa Indonesia' },
  { text: 'Seni seviyorum', language: 'Türkçe' },
  { text: "Σ' αγαπώ", language: 'Ελληνικά' },
  { text: 'Anh yêu em', language: 'Tiếng Việt' },
  { text: 'Kocham cię', language: 'Polski' },
  { text: 'Ik hou van jou', language: 'Nederlands' },
  { text: 'Jeg elsker dig', language: 'Dansk' },
  { text: 'Dúbh fort an', language: 'Gaeilge' },
  { text: 'Amor', language: 'Latin' },
];
const tracedPhrases = Array.from({ length: 80 }, (_, index) => ({
  ...phrases[index % phrases.length],
  t: (index - 40) * 0.15,
}));

const pointAt = (t: number) => {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  return { x: 310 + x * 12.35, y: 280 - y * 12.35 };
};

const heartPath = Array.from({ length: 321 }, (_, index) => {
  const point = pointAt((index / 320) * Math.PI * 2);
  return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`;
}).join(' ') + ' Z';

function HeartArtwork({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  const revealedCount = Math.floor(progress * tracedPhrases.length + 0.0001);
  return (
    <section className="artwork fade-in delay" aria-label="Animated multilingual heart">
      <div className="artwork-head">
        <span>Studies in affection · No. 01</span>
        <span className="live-status" aria-live="polite">
          <span className="live-dot" />
          {progress >= 1 ? 'Complete' : reducedMotion ? 'Still view' : 'Tracing'}
        </span>
      </div>
      <div className="heart-stage">
        <svg
          className="heart-svg"
          viewBox="0 0 620 535"
          role="img"
          aria-labelledby="heart-title heart-desc"
        >
          <title id="heart-title">A heart drawn in words of love</title>
          <desc id="heart-desc">
            A parametric heart curve gradually traced by sixteen expressions of love, repeated around the line, with doua at its center.
          </desc>
          <path className="heart-guide" d={heartPath} />
          <path
            className="heart-trace"
            d={heartPath}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - progress}
          />
          {tracedPhrases.map((phrase, index) => {
            const point = pointAt(phrase.t);
            const dx = point.x - 310;
            const dy = point.y - 280;
            const length = Math.hypot(dx, dy) || 1;
            const outward = index % 2 === 0 ? 18 : 19;
            return (
              <text
                key={`${phrase.language}-${index}`}
                className={`phrase ${index % 2 === 0 ? 'phrase-rose' : 'phrase-blush'}${index < revealedCount ? ' visible' : ''}`}
                x={point.x + (dx / length) * outward}
                y={point.y + (dy / length) * outward + 3}
                textAnchor="middle"
                aria-hidden="true"
              >
                {phrase.text}
              </text>
            );
          })}
          <text
            className="heart-center"
            x="310"
            y="286"
            textAnchor="middle"
            dominantBaseline="middle"
            data-testid="text-heart-center-doua"
          >
            doua
          </text>
        </svg>
      </div>
      <div className="stage-footer">
        <span>One small shape, many ways to say it</span>
        <span className="stage-count">{String(revealedCount).padStart(2, '0')} / 80 words</span>
      </div>
    </section>
  );
}

function Home() {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) {
        setProgress(1);
        setPlaying(false);
      }
    };
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const interval = window.setInterval(() => {
      setProgress((current) => {
        return Math.min(1, current + 0.05 / (18 * speed));
      });
    }, 50);
    return () => window.clearInterval(interval);
  }, [playing, reducedMotion, speed]);

  useEffect(() => {
    if (progress >= 1) setPlaying(false);
  }, [progress]);

  const replay = () => {
    if (reducedMotion) {
      setProgress(1);
      setPlaying(false);
      return;
    }
    setProgress(0);
    setPlaying(true);
  };

  return (
    <main className="keepsake">
      <header className="topbar fade-in">
        <div className="wordmark">
          <span className="wordmark-mark" aria-hidden="true">l</span>
          <span>Love, in every language</span>
        </div>
        <div className="top-note"><span /> A little keepsake for the heart</div>
      </header>

      <div className="hero">
        <section className="intro fade-in" aria-labelledby="page-title">
          <div className="eyebrow">A living love letter</div>
          <h1 id="page-title" className="headline">
            More than one way to say <em>always.</em>
          </h1>
          <p className="lede">
            Sixteen little declarations, following one familiar line. Let each
            language find its place around the same heart.
          </p>
          <div className="language-row" aria-label="Languages represented">
            {phrases.map((phrase) => (
              <span className="language-chip" key={phrase.language}>{phrase.language}</span>
            ))}
          </div>
        </section>

        <HeartArtwork progress={progress} reducedMotion={reducedMotion} />
      </div>

      <section className="control-panel" aria-label="Animation controls">
        <div className="control-caption">
          The drawing
          <strong>{progress >= 1 ? 'A whole heart, in every tongue' : 'Unfolding one phrase at a time'}</strong>
        </div>
        <div className="transport">
          <button
            className="control-button primary"
            onClick={() => {
              if (reducedMotion) return;
              if (progress >= 1) {
                setProgress(0);
                setPlaying(true);
              } else {
                setPlaying((current) => !current);
              }
            }}
            aria-label={playing ? 'Pause animation' : progress >= 1 ? 'Play animation again' : 'Resume animation'}
            title={reducedMotion ? 'Animation disabled by reduced-motion preference' : undefined}
          >
            {playing ? <Pause size={15} strokeWidth={1.8} /> : <Play size={15} strokeWidth={1.8} />}
            {playing ? 'Pause' : progress >= 1 ? 'Play again' : 'Resume'}
          </button>
          <button
            className="control-button icon-only"
            onClick={replay}
            aria-label="Replay the heart"
            title="Replay"
          >
            <RotateCcw size={15} strokeWidth={1.8} />
          </button>
        </div>
        <label className="speed-control">
          <span className="speed-top">
            <span>Drawing pace</span>
            <span className="speed-value">{speed.toFixed(1)}×</span>
          </span>
          <input
            className="speed-slider"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            aria-label="Animation speed"
          />
        </label>
      </section>

      <footer className="page-foot">
        <span>Drawn from a single continuous curve</span>
        {reducedMotion ? (
          <span className="reduced-note">Reduced motion · still artwork</span>
        ) : (
          <span>Made to be kept</span>
        )}
      </footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
