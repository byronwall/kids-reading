import { dictionary } from "cmu-pronouncing-dictionary";

export type SyllableInfo = {
  syllables: string[];
  stressLevels: number[];
  arpabet: string;
};

export function getArpabet(word: string): string | undefined {
  const arpabetCode = dictionary[word];

  return arpabetCode;
}

export function getSyllables(word: string): SyllableInfo {
  const arpabetCode = getArpabet(word);

  if (arpabetCode === undefined) {
    throw new Error(`Word not found: ${word}`);
  }

  return splitArpabet(arpabetCode);
}

// rules that appears to be true for splitting into syllables
// all syllable parts must be returned -- don't drop any
// only 1 number = return everything as a single syllable "D AO1 G"

// maybe a 1 tells you to split the syllable before it
// "JH ER1 N IY0" = "JH ER1 | N IY0"
// "OW1 SH AH0 N" = "OW1 | SH AH0 N"
// "P AH0 T EY1 T OW2" = "P AH0 | T EY1 | T OW2"

// vowels together must be split there
// "S K W ER1 AH0 L" = "S K W ER1 | AH0 L"

// lots of consonants together must be split ???
// "D IH0 K T EY1 T ER0 SH IH2 P" = "D IH0 K | T EY1 | T ER0 | SH IH2 P" - between doubles?
// "K AH1 M F ER0 T AH0 B AH0 L" = "K AH1 M | F ER0 | T AH0 | B AH0 L"
// "K AA1 N S T AH0 B AH0 L" = "K AA1 N | S T AH0 | B AH0 L"  - three = split in middle??
// "AH0 T EH1 N SH AH0 N" = "AH0 | T EH1 N | SH AH0 N" - between doubles

export function splitArpabet(arpabet: string): SyllableInfo {
  type SyllablePiece = {
    part: string;
    stressLevel?: number;
  };

  // split on space
  const pieces = arpabet.split(" ").map((c) => c.trim());

  // convert pieces to syllable pieces
  const syllablePieces: SyllablePiece[] = pieces.map((part) => {
    const _stressLevel = Number(part.match(/[0-9]/)?.[0]);
    const stressLevel = isNaN(_stressLevel) ? undefined : _stressLevel;

    // remove last character if stress level
    if (stressLevel !== undefined) {
      part = part.slice(0, -1);
    }

    return { part, stressLevel };
  });

  // put the pieces into groups

  const groups: SyllablePiece[][] = [[]];

  let curGroupHasVowel = false;

  for (let i = 0; i < syllablePieces.length; i++) {
    const prevPiece = syllablePieces[i - 1];
    const piece = syllablePieces[i];
    const nextPiece = syllablePieces[i + 1];

    // determine if current piece should start a new group
    const isVowel = piece?.stressLevel !== undefined;

    if (curGroupHasVowel) {
      const isNextVowel = nextPiece?.stressLevel !== undefined;

      const wasPrevVowel = prevPiece?.stressLevel !== undefined;

      const nextTwoVowels = isVowel || isNextVowel;

      const tripleConsonant = !wasPrevVowel && !isVowel && !isNextVowel;

      if (nextTwoVowels || tripleConsonant) {
        groups.push([]);
        curGroupHasVowel = false;
      }
    }

    const curGroup = groups[groups.length - 1];

    if (curGroup === undefined || piece === undefined) {
      throw new Error(`curGroup is undefined`);
    }

    // if piece has stress level, add it to the group

    curGroup.push(piece);

    if (isVowel) {
      curGroupHasVowel = true;
    }
  }

  const syllables = groups.map((group) => group.map((p) => p.part).join(" "));
  const stressLevels = groups
    .map((group) =>
      group.reduce<number | undefined>((acc, p) => {
        if (acc !== undefined) {
          return acc;
        }

        return p.stressLevel;
      }, undefined)
    )
    .filter((n) => n !== undefined) as number[];

  // create groups of syllables from syllable pieces

  return { syllables, stressLevels, arpabet };
}
