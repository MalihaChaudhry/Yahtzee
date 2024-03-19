import { create } from 'zustand';

export const rand = (max = 6) => Math.floor(Math.random() * max) + 1;

const createDice = () => {
  return [
    { val: rand(), isLocked: false },
    { val: rand(), isLocked: false },
    { val: rand(), isLocked: false },
    { val: rand(), isLocked: false },
    { val: rand(), isLocked: false },
  ];
};

const createTallyLower = () => {
  return {
    threeOfAKind: { val: 0, clicked: false },
    fourOfAKind: { val: 0, clicked: false },
    fullHouse: { val: 0, clicked: false },
    smallStraight: { val: 0, clicked: false },
    largeStraight: { val: 0, clicked: false },
    yahtzee: { val: 0, clicked: false },
    chance: { val: 0, clicked: false },
  };
};

const createTallyUppper = () => {
  return {
    1: { val: 0, clicked: false },
    2: { val: 0, clicked: false },
    3: { val: 0, clicked: false },
    4: { val: 0, clicked: false },
    5: { val: 0, clicked: false },
    6: { val: 0, clicked: false },
  };
};

const useYahtzeeStore = create((set) => ({
  dice: createDice(),
  diceSum: 0,
  diceValues: {},
  isGameover: false,
  rollsLeft: 2,
  tallyLower: createTallyLower(),
  tallyUpper: createTallyUppper(),
  totalScore: 0,
  resetGame: () =>
    set(() => ({
      dice: createDice(),
      diceSum: 0,
      diceValues: {},
      isGameover: false,
      rollsLeft: 2,
      tallyLower: createTallyLower(),
      tallyUpper: createTallyUppper(),
      totalScore: 0,
    })),
  setDice: (dice) => set(() => ({ dice })),
  setDiceSum: (diceSum) => set(() => ({ diceSum })),
  setDiceValues: (diceValues) => set(() => ({ diceValues })),
  setIsGameover: (isGameover) => set(() => ({ isGameover })),
  setRollsLeft: (rollsLeft) => set(() => ({ rollsLeft })),
  setTallyLower: (tallyLower) => set(() => ({ tallyLower })),
  setTallyUpper: (tallyUpper) => set(() => ({ tallyUpper })),
  setTotalScore: (totalScore) => set(() => ({ totalScore })),
}));

export default useYahtzeeStore;
