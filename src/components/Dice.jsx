import PropTypes from 'prop-types';
import Die from './Die';
import useYahtzeeStore, { rand } from '../stores/useYahtzeeStore';

const Dice = () => {
  const dice = useYahtzeeStore((state) => state.dice);
  const rollsLeft = useYahtzeeStore((state) => state.rollsLeft);
  const setDice = useYahtzeeStore((state) => state.setDice);
  const setRollsLeft = useYahtzeeStore((state) => state.setRollsLeft);

  const changeLocked = (id) => {
    const diceCopy = [...dice];
    diceCopy[id].isLocked = !diceCopy[id].isLocked;
    setDice(diceCopy);
  };

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
      <div className='five-dice'>
        {dice.map((die, i) => {
          return (
            <Die
              key={i}
              id={i}
              isLocked={die.isLocked}
              val={die.val}
              changeLocked={changeLocked}
            />
          );
        })}
      </div>
      <button
        className='roll-button'
        disabled={rollsLeft === 0}
        onClick={rollDice}
      >
        {`${rollsLeft} Rolls Left`}
      </button>
    </>
  );
};

Dice.propTypes = {
  dice: PropTypes.array,
  setDice: PropTypes.func,
  rollsLeft: PropTypes.number,
  setRollsLeft: PropTypes.func,
};

export default Dice;
