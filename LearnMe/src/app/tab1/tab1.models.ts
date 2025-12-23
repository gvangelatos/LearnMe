export interface WordCardModel {
  german_translation: string;
  english_translation: string;
  isUnknown: boolean;
  isSwipeRight: boolean;
  isSwipeLeft: boolean;
  article: string | null;
  id: string;
}
