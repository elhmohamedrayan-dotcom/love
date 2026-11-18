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
const pointAt = (t: number) => {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  return { x: 400 + x * 20, y: 400 - y * 20 };
};

const heartPath = Array.from({ length: 321 }, (_, index) => {
  const point = pointAt((index / 320) * Math.PI * 2);
  return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`;
}).join(' ') + ' Z';

const heartRows = Array.from({ length: 34 }, (_, row) => ({
  y: 100 + row * 19,
  phrases: Array.from(
    { length: 16 },
    (_, index) => phrases[(row * 3 + index) % phrases.length].text,
  ).join('   '),
}));

function Home() {
  return (
    <main className="love-scene">
      <svg
        className="love-art"
        viewBox="0 0 800 800"
        role="img"
        aria-labelledby="heart-title heart-desc"
      >
        <title id="heart-title">رسالة حب إلى دعاء من ريان</title>
        <desc id="heart-desc">
          عبارات أحبك بلغات مختلفة تشكل قلباً، وكلمة دعاء في الوسط، وتوقيع من ريان.
        </desc>
        <defs>
          <clipPath id="heart-clip">
            <path d={heartPath} />
          </clipPath>
        </defs>
        <g clipPath="url(#heart-clip)">
          {heartRows.map((row, index) => (
            <text
              key={row.y}
              className={`heart-words ${index % 2 === 0 ? 'heart-words-rose' : 'heart-words-light'}`}
              x="400"
              y={row.y}
              textAnchor="middle"
              opacity="0.95"
            >
              {row.phrases}
            </text>
          ))}
        </g>
        <text
          className="heart-dedication"
          x="400"
          y="402"
          textAnchor="middle"
          dominantBaseline="middle"
          data-testid="text-heart-dedication"
        >
          دعاء
        </text>
        <text
          className="sender-signature"
          x="400"
          y="778"
          textAnchor="middle"
          direction="rtl"
          data-testid="text-sender-signature"
        >
          من ريان
        </text>
      </svg>
    </main>
  );
}

export default Home;
