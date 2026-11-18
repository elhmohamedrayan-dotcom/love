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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className={`next-page letter-page${isOpen ? ' is-open' : ''}`} data-testid="page-next">
      <Link href="/heart" className="back-link letter-back" data-testid="link-back-heart">
        <span aria-hidden="true">←</span> Back to the heart
      </Link>
      <section className="letter-scene" aria-labelledby="letter-heading">
        <p className="letter-eyebrow" data-testid="text-letter-eyebrow">A letter, kept close</p>
        <h1 id="letter-heading" className="letter-heading" data-testid="text-letter-heading">
          For Doua
        </h1>
        <p className="letter-invitation" aria-live="polite" data-testid="text-letter-invitation">
          {isOpen ? 'A few words, from my heart.' : 'There is something I wanted you to keep.'}
        </p>

        <div className="envelope-stage" data-testid="envelope-stage">
          <article
            className="letter-paper"
            dir="rtl"
            lang="ar"
            aria-label="A poem for Doua from Rayan"
            data-testid="letter-paper"
          >
            <div className="paper-rule" aria-hidden="true" />
            <div className="poem-copy" data-testid="text-poem">
              <p>إلى دعاء..</p>
              <p>أَمَا رأيتِ كيف القلبُ يبتسِمُ؟</p>
              <p>وحين تُشرقين، الأيام تبتسمُ!</p>
              <p>تعلّمتُ الحروفَ بكل ألسنة الورى</p>
              <p>لكنَّ اسمَكِ وحدَهُ في الروح ينحسمُ</p>
              <p>بنيتُ لكِ الفؤادَ قصورَ عِشقٍ دافئة</p>
              <p>بها كلُّ اللغاتِ لصوتكِ تنضمُ</p>
              <p>فأنتِ النبضُ إن ضاق الزمان بنا</p>
              <p>وأنتِ الروحُ، بل أنتِ التي تُهيمُ</p>
            </div>
            <p className="paper-signature" dir="ltr">Rayan</p>
          </article>
          <div className="envelope" aria-hidden="true">
            <div className="envelope-back" />
            <div className="envelope-pocket" />
            <div className="envelope-flap" />
            <div className="envelope-shade" />
          </div>
          <button
            type="button"
            className="seal-button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? 'Close the letter' : 'Open the letter'}
            aria-expanded={isOpen}
            aria-controls="letter-heading"
            data-testid="button-letter-seal"
          >
            <svg className="seal-heart" viewBox="0 0 64 58" aria-hidden="true">
              <path d="M32 55 6.8 30.4C-5.2 17 5.1 1 19.1 5.1 25 6.8 29 11.4 32 15c3-3.6 7-8.2 12.9-9.9C58.9 1 69.2 17 57.2 30.4L32 55Z" />
            </svg>
            <span className="seal-initial" aria-hidden="true">R</span>
          </button>
        </div>
        <p className="letter-footnote" data-testid="text-letter-footnote">
          {isOpen ? 'Tap the seal to fold it away.' : 'Open with a little tap.'}
        </p>
      </section>
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
