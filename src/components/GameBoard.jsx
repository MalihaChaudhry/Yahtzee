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
    </>
  );
};

export default GameBoard;
