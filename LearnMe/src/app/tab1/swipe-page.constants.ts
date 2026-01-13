import { WordCardModel } from './tab1.models';

export const SWIPE_THRESSHOLD = 80;

export const WORD_CARDS: WordCardModel[] = [
  {
    german_translation: 'Tisch',
    english_translation: 'Table',
    isUnknown: false,
    isSwipeRight: false,
    isSwipeLeft: false,
    article: 'Der',
    id: '1',
  },
  {
    german_translation: 'Fliegen',
    english_translation: 'To Fly',
    isUnknown: false,
    isSwipeRight: false,
    isSwipeLeft: false,
    article: undefined,
    id: '2',
  },
  {
    german_translation: 'Fahren',
    english_translation: 'To Drive',
    isUnknown: false,
    isSwipeRight: false,
    isSwipeLeft: false,
    article: undefined,
    id: '3',
  },
  {
    german_translation: 'Schuler',
    english_translation: 'Student(Male)',
    isUnknown: false,
    isSwipeRight: false,
    isSwipeLeft: false,
    article: 'Der',
    id: '4',
  },
];
