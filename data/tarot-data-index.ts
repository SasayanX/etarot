// Import necessary data files
import { majorArcanaCards } from "./tarot-major-arcana"
import { cupsCards } from "./tarot-cups"
import { pentaclesCards } from "./tarot-pentacles"
import { swordsCards } from "./tarot-swords"
import { wandsCards } from "./tarot-wands"

// Function to get major arcana cards
export const getMajorArcana = () => {
  return majorArcanaCards
}

// Function to get minor arcana cards
export const getMinorArcana = () => {
  return [...cupsCards, ...pentaclesCards, ...swordsCards, ...wandsCards]
}

// Function to get cards by suit
export const getCardsBySuit = (suit: string) => {
  switch (suit) {
    case "wands":
      return wandsCards
    case "cups":
      return cupsCards
    case "swords":
      return swordsCards
    case "pentacles":
      return pentaclesCards
    default:
      return []
  }
}

// Combine all cards into a single array
export const allCards = [...majorArcanaCards, ...cupsCards, ...pentaclesCards, ...swordsCards, ...wandsCards]
