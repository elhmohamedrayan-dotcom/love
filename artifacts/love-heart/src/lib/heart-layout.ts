export const HEART_SIZE = 800;
export const HEART_CENTER = HEART_SIZE / 2;

export const LOVE_PHRASES = [
  'احبك',
  'I love you',
  "Je t'aime, Je t'adore",
  'Ek het jou lief',
  'Te dua',
  'Yes kez sirumen',
  "M'bi fe",
  'Aamee tuma ke bhalo aashi',
  'Ya tabe kahayu',
  'Nahigugma ako kanimo',
  'Obicham te',
  'Soro lahn nhee ah',
  'Ngo oiy ney a',
  "T'estimo",
  'Ne mohotatse',
  'Ndimakukonda',
  'Ti tengu caru',
  'Mi aime jou',
  'Volim te',
  'Miluji te',
  'Jeg Elsker Dig',
  'Ik hou van jou',
  'Mi amas vin',
  'Ma armastan sind',
  "Afgreki'",
  'Eg elski teg',
  'Doset daram',
  'Mahal kita',
  'Mina rakastan sinua',
  'Ta gra agam ort',
  'Mikvarhar',
  'Ich liebe dich',
  "S'agapo",
  'Hoo thunay prem karoo choo',
  'Palangga ko ikaw',
  'Aloha wau ia oi',
  'Ani ohev otah / Ani ohev et otha',
  'Hum Tumhe Pyar Karte hae',
  'Kuv hlub koj',
  "Nu' umi unangwa'ta",
  'Szeretlek',
  'Eg elska tig',
  'Saya cinta padamu',
  'Negligevapse',
  "Taim i' ngra leat",
  'Ti amo',
  'Aishiteru',
  'Naanu ninna preetisuttene',
  'Kaluguran daka',
  'Nakupenda',
  'Tu magel moga cho',
  'Sarang Heyo',
  'Es tevi miilu',
  'Bahibak',
  'Tave myliu',
  'Saya cintakan mu / Aku cinta padamu',
  'Njan Ninne Premikunnu',
  'Wo ai ni',
  'Me tula prem karto',
  'Kanbhik',
  'Ana moajaba bik',
  'Ni mits neki',
  "Ayor anosh'ni",
  'Jeg Elsker Deg',
  'Syota na kita!!',
  'Inaru Taka',
  'Mi ta stimabo',
  'Doo-set daaram',
  'Iay ovlay ouyay',
  'Kocham Ciebie',
  'Eu te amo',
  'Te ubesk',
  'Ya tebya liubliu',
  'Tha gra\\dh agam ort',
  'Ke a go rata',
  'Maa tokhe pyar kendo ahyan',
  'Techihhila',
  "Lu'bim ta",
  'Ljubim te',
  'Te quiero / Te amo',
  'Ninapenda wewe',
  'Jag alskar dig',
  'Ich lieb Di',
  'Wa ga ei li',
  'Ua Here Vau Ia Oe',
  'Nan unnai kathalikaraen',
  'Nenu ninnu premistunnanu',
  'Chan rak khun / Phom rak khun',
  'Seni Seviyorum',
  'Ya tebe kahayu',
  'mai aap say pyaar karta hoo',
  'Anh ye^u em / Em ye^u anh',
  "'Rwy'n dy garu",
  'Ikh hob',
];

export type PhrasePlacement = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  color: 'rose' | 'blush';
};

type Point = { x: number; y: number };
type Segment = { left: number; right: number };
type SegmentBin = Segment & {
  y: number;
  cursor: number;
  remaining: number;
};

const PHRASE_GAP = 6;
const MIN_PHRASE_WIDTH = 36;

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
    return width + (wideGlyph ? 10 : 6.3);
  }, 0);
  return measured + 6;
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
  const bins: SegmentBin[] = [];

  for (let y = 84; y <= 730; y += 16) {
    const segments = intervalsAt(y).flatMap((segment) =>
      leaveDedicationSpace(segment, y),
    );

    for (const segment of segments) {
      const left = segment.left + 4;
      const right = segment.right - 4;
      if (right - left < MIN_PHRASE_WIDTH + PHRASE_GAP) continue;
      bins.push({ left, right, y, cursor: left, remaining: right - left });
    }
  }

  const queue = shuffle(
    LOVE_PHRASES.map((text) => ({ text, width: estimatePhraseWidth(text) })),
    random,
  ).sort((left, right) => right.width - left.width);

  const addPlacement = (bin: SegmentBin, text: string, width: number) => {
    placements.push({
      id: `phrase-${placements.length}`,
      text,
      x: bin.cursor + width / 2,
      y: bin.y,
      width,
      color: placements.length % 2 === 0 ? 'rose' : 'blush',
    });
    bin.cursor += width + PHRASE_GAP;
    bin.remaining -= width + PHRASE_GAP;
  };

  for (const phrase of queue) {
    const fittingBins = bins
      .filter((bin) => bin.remaining >= phrase.width + PHRASE_GAP)
      .sort((left, right) => left.remaining - right.remaining);

    if (fittingBins.length > 0) {
      const bestFitCount = Math.min(4, fittingBins.length);
      const bin = fittingBins[Math.floor(random() * bestFitCount)];
      addPlacement(bin, phrase.text, phrase.width);
      continue;
    }

    const largestBin = bins.reduce<SegmentBin | undefined>(
      (best, bin) =>
        !best || bin.remaining > best.remaining ? bin : best,
      undefined,
    );
    if (!largestBin || largestBin.remaining < MIN_PHRASE_WIDTH + PHRASE_GAP) {
      throw new Error('The heart is too small to place every love phrase.');
    }

    addPlacement(
      largestBin,
      phrase.text,
      largestBin.remaining - PHRASE_GAP,
    );
  }

  for (const bin of shuffle(bins, random)) {
    while (bin.remaining >= MIN_PHRASE_WIDTH + PHRASE_GAP) {
      const fittingPhrases = LOVE_PHRASES.filter(
        (phrase) =>
          estimatePhraseWidth(phrase) + PHRASE_GAP <= bin.remaining,
      );
      const shortestPhrase = LOVE_PHRASES.reduce((shortest, phrase) =>
        estimatePhraseWidth(phrase) < estimatePhraseWidth(shortest)
          ? phrase
          : shortest,
      );
      const phrase =
        fittingPhrases[Math.floor(random() * fittingPhrases.length)] ??
        shortestPhrase;
      const width = Math.min(
        estimatePhraseWidth(phrase),
        bin.remaining - PHRASE_GAP,
      );
      if (width < MIN_PHRASE_WIDTH) break;
      addPlacement(bin, phrase, width);
    }
  }

  return shuffle(placements, random);
}
