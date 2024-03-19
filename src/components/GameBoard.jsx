import { useState } from 'react';
import Dice from './Dice';
import ScoreCard from './ScoreCard';
import useYahtzeeStore, { rand } from '../stores/useYahtzeeStore';

const GameBoard = () => {
  const dice = useYahtzeeStore((state) => state.dice);
  const isGameover = useYahtzeeStore((state) => state.isGameover);
  const resetGame = useYahtzeeStore((state) => state.resetGame);
  const rollsLeft = useYahtzeeStore((state) => state.rollsLeft);
  const setDice = useYahtzeeStore((state) => state.setDice);
  const setRollsLeft = useYahtzeeStore((state) => state.setRollsLeft);

  const [isOpen, setIsOpen] = useState(false);

  const rollDice = () => {
    const updatedArr = dice.map((die) => {
      if (!die.isLocked) {
        die.val = rand();
      }
      return die;
    });
    setDice(updatedArr);
    if (rollsLeft > 0) {
      setRollsLeft(rollsLeft - 1);
    } else {
      setRollsLeft(2);
      const reset = dice.map((die) => {
        die.val = rand();
        die.isLocked = false;
        return die;
      });
      setDice(reset);
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Dice />
      {isGameover ? (
        <button className='button' onClick={resetGame}>
          Play Again
        </button>
      ) : (
        <button
          className='button'
          disabled={rollsLeft === 0}
          onClick={rollDice}
        >
          {`${rollsLeft} Rolls Left`}
        </button>
      )}
      <ScoreCard />
      <button onClick={toggleModal}>Game Rules</button>
      <div isOpen={isOpen} onClose={toggleModal}>
        <ul className='modal-container'>
          <li>Ones</li>
          <p>Points scored: Receive 1 point for each 1 rolled</p>
          <li>Twos</li>
          <p>Points scored: Receive 2 point for each 2 rolled</p>
          <li>Threes</li>
          <p>Points scored: Receive 3 point for each 3 rolled</p>
          <li>Fours</li>
          <p>Points scored: Receive 4 point for each 4 rolled</p>
          <li>Fives</li>
          <p>Points scored: Receive 5 point for each 5 rolled</p>
          <li>Sixes</li>
          <p>Points scored: Receive 6 point for each 6 rolled</p>
          <li>Three of a Kind</li>
          <p>Needed to Score: Three dice of the same number</p>
          <p>Points scored: Sum of all dice</p>
          <li>Four of a Kind</li>
          <p>Needed to Score: Four dice of the same number</p>
          <p>Points scored: Sum of all dice</p>
          <li>Full House</li>
          <p>
            Needed to Score: Three dice of the same number and two dice of
            another number
          </p>
          <p>Points scored: 25 points</p>
          <li>Small Straight</li>
          <p>Needed to Score: Any four consecutive numbers - ex: 3, 4, 5, 6</p>
          <p>Points scored: 30 points</p>
          <li>Large Straight</li>
          <p>
            Needed to Score: Any five consecutive numbers - ex: 1, 2, 3, 4, 5
          </p>
          <p>Points scored: 40 points</p>
          <li>Yahtzee</li>
          <p>Needed to Score: Five dice of the same number</p>
          <p>Points scored: 50 points</p>
          <li>Chance</li>
          <p>Needed to Score: Any combination of dice</p>
          <p>Points scored: Sum of all dice</p>
        </ul>
      </div>
    </>
  );
};

export default GameBoard;
