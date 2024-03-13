import { useCallback, useEffect } from 'react';
import useYahtzeeStore from '../stores/useYahtzeeStore';

import RuleRows from './RuleRows';

const ScoreCard = () => {
  const dice = useYahtzeeStore((state) => state.dice);
  const setDiceSum = useYahtzeeStore((state) => state.setDiceSum);

  const findSum = useCallback(() => {
    const sum = dice.reduce((sum, die) => sum + die.val, 0);
    setDiceSum(sum);
  }, [dice, setDiceSum]);

  useEffect(() => findSum(), [dice, findSum]);

  return (
    <div>
      <RuleRows />
    </div>
  );
};

export default ScoreCard;
