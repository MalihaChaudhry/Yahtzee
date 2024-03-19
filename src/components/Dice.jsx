import PropTypes from 'prop-types';
import Die from './Die';
import useYahtzeeStore from '../stores/useYahtzeeStore';

const Dice = () => {
  const dice = useYahtzeeStore((state) => state.dice);
  const setDice = useYahtzeeStore((state) => state.setDice);

  const changeLocked = (id) => {
    const diceCopy = [...dice];
    diceCopy[id].isLocked = !diceCopy[id].isLocked;
    setDice(diceCopy);
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
