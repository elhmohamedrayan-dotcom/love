export const HEART_SIZE = 800;
export const HEART_CENTER = HEART_SIZE / 2;

export const LOVE_PHRASES = [
  'I love you',
  "Je t'aime",
  'Te amo',
  'Ich liebe dich',
  'الخ (أحبك)',
  '사랑해',
  'Я тебя люблю',
  'Aku cinta kamu',
  'Seni seviyorum',
  "Σ' αγαπώ",
  'Anh yêu em',
  'Kocham cię',
  'Ik hou van jou',
  'Jeg elsker dig',
  'Dúbh fort an',
  'Amor',
];

export type PhrasePlacement = {
  id: string;
  text: string;
  x: number;
  y: number;
  color: 'rose' | 'blush';
};

type Point = { x: number; y: number };
type Segment = { left: number; right: number };

const points: Point[] = Array.from({ length: 720 }, (_, index) => {
  const angle = (index / 720) * Math.PI * 2;
  const x = 16 * Math.sin(angle) ** 3;
  const y =
    13 * Math.cos(angle) -
    5 * Math.cos(2 * angle) -
    2 * Math.cos(3 * angle) -
    Math.cos(4 * angle);
  return {
    x: HEART_CENTER + x * 20,
    y: HEART_CENTER - y * 20,
  };
});

export const HEART_PATH =
  points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`,
    )
    .join(' ') + ' Z';

function intervalsAt(y: number): Segment[] {
  const intersections: number[] = [];

  for (let index = 0; index < points.length; index += 1) {
    const start = points[index];
    const end = points[(index + 1) % points.length];

    if ((start.y <= y && end.y > y) || (end.y <= y && start.y > y)) {
      const fraction = (y - start.y) / (end.y - start.y);
      intersections.push(start.x + fraction * (end.x - start.x));
    }
  }

  intersections.sort((left, right) => left - right);
  const segments: Segment[] = [];

  for (let index = 0; index + 1 < intersections.length; index += 2) {
    segments.push({
      left: intersections[index],
      right: intersections[index + 1],
    });
  }

  return segments;
}

function leaveDedicationSpace(segment: Segment, y: number): Segment[] {
  if (y < 350 || y > 450) return [segment];

  const leftEdge = HEART_CENTER - 126;
  const rightEdge = HEART_CENTER + 126;
  const remaining: Segment[] = [];

  if (segment.left < leftEdge) {
    remaining.push({
      left: segment.left,
      right: Math.min(segment.right, leftEdge),
    });
  }
  if (segment.right > rightEdge) {
    remaining.push({
      left: Math.max(segment.left, rightEdge),
      right: segment.right,
    });
  }

  return remaining.filter((part) => part.right - part.left > 44);
}

function estimatePhraseWidth(phrase: string): number {
  const measured = Array.from(phrase).reduce((width, character) => {
    const wideGlyph = /[\u0600-\u06ff\u2e80-\u9fff\uac00-\ud7af]/u.test(character);
    return width + (wideGlyph ? 10 : 7.6);
  }, 0);
  return measured + 12;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

export function createRandomHeartLayout(
  random: () => number = Math.random,
): PhrasePlacement[] {
  const placements: PhrasePlacement[] = [];

  for (let y = 96; y <= 730; y += 18) {
    const segments = intervalsAt(y).flatMap((segment) =>
      leaveDedicationSpace(segment, y),
    );

    for (const segment of segments) {
      let cursor = segment.left + 4;

      while (cursor < segment.right - 18) {
        const remaining = segment.right - cursor;
        const candidates = LOVE_PHRASES.filter(
          (phrase) => estimatePhraseWidth(phrase) <= remaining - 4,
        );

        if (candidates.length === 0) break;

        const phrase =
          candidates[Math.floor(random() * candidates.length)] ?? 'Amor';
        const width = estimatePhraseWidth(phrase);

        placements.push({
          id: `phrase-${placements.length}`,
          text: phrase,
          x: cursor + width / 2,
          y,
          color: placements.length % 2 === 0 ? 'rose' : 'blush',
        });

        cursor += width + 7;
      }
    }
  }

  return shuffle(placements, random);
}
