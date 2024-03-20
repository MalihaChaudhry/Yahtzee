import { useCallback, useEffect } from 'react';
import useYahtzeeStore, { rand } from '../stores/useYahtzeeStore';
import PropTypes from 'prop-types';

const RuleRows = () => {
  const dice = useYahtzeeStore((state) => state.dice);
  const diceSum = useYahtzeeStore((state) => state.diceSum);
  const diceValues = useYahtzeeStore((state) => state.diceValues);
  const isGameover = useYahtzeeStore((state) => state.isGameover);
  const tallyLower = useYahtzeeStore((state) => state.tallyLower);
  const tallyUpper = useYahtzeeStore((state) => state.tallyUpper);
  const totalScore = useYahtzeeStore((state) => state.totalScore);
  const setDice = useYahtzeeStore((state) => state.setDice);
  const setDiceValues = useYahtzeeStore((state) => state.setDiceValues);
  const setIsGameover = useYahtzeeStore((state) => state.setIsGameover);
  const setRollsLeft = useYahtzeeStore((state) => state.setRollsLeft);
  const setTallyLower = useYahtzeeStore((state) => state.setTallyLower);
  const setTallyUpper = useYahtzeeStore((state) => state.setTallyUpper);
  const setTotalScore = useYahtzeeStore((state) => state.setTotalScore);

  const resetDice = useCallback(() => {
    if (isGameover) {
      setRollsLeft(0);
    } else {
      setRollsLeft(2);
      const reset = dice.map((die) => {
        die.val = rand();
        die.isLocked = false;
        return die;
      });
      setDice(reset);
    }
  }, [dice, isGameover, setDice, setRollsLeft]);

  const diceValueCounter = useCallback(() => {
    const vals = dice.reduce((obj, die) => {
      if (Object.hasOwn(obj, die.val)) {
        obj[die.val]++;
      } else {
        obj[die.val] = 1;
      }
      return obj;
    }, {});
    setDiceValues(vals);
  }, [dice, setDiceValues]);

  const upperPoints = (num) => {
    if (tallyUpper[num].clicked) return;
    const total = dice.reduce((count, die) => {
      if (die.val === num) {
        count += die.val;
      }
      return count;
    }, 0);
    const copyTallyUpper = { ...tallyUpper };
    copyTallyUpper[num].val = total;
    copyTallyUpper[num].clicked = true;
    setTallyUpper(copyTallyUpper);
    resetDice();
  };

  const lowerPoints = (rule) => {
    if (tallyLower[rule].clicked) return;
    switch (rule) {
      case 'threeOfAKind':
        return ofAKind('threeOfAKind', 3);
      case 'fourOfAKind':
        return ofAKind('fourOfAKind', 4);
      case 'fullHouse':
        return fullHouse();
      case 'smallStraight':
        return smallStraight();
      case 'largeStraight':
        return largeStraight();
      case 'yahtzee':
        return ofAKind('yahtzee', 5);
      case 'chance':
        return chance();
    }
  };

  const ofAKind = (rule, minNum) => {
    const copyTallyLower = { ...tallyLower };
    const numOfAKind =
      Object.values(diceValues).filter((num) => num > minNum - 1).length > 0;

    if (rule === 'yahtzee') {
      numOfAKind
        ? (copyTallyLower[rule].val = 50)
        : (copyTallyLower[rule].val = 0);
    } else {
      numOfAKind
        ? (copyTallyLower[rule].val = diceSum)
        : (copyTallyLower[rule].val = 0);
    }

    copyTallyLower[rule].clicked = true;
    setTallyLower(copyTallyLower);

    resetDice();
  };

  const fullHouse = () => {
    const copyTallyLower = { ...tallyLower };
    const three = Object.values(diceValues).includes(3);
    const two = Object.values(diceValues).includes(2);

    copyTallyLower['fullHouse'].val = two && three ? 25 : 0;
    copyTallyLower['fullHouse'].clicked = true;

    setTallyLower(copyTallyLower);
    resetDice();
  };

  const smallStraight = () => {
    const copyTallyLower = { ...tallyLower };

    const reqs = [
      [1, 2, 3, 4],
      [2, 3, 4, 5],
      [3, 4, 5, 6],
    ];

    const nums = Object.keys(diceValues).map(Number);

    copyTallyLower['smallStraight'].val = reqs.some((arr) =>
      arr.every((num) => nums.includes(num))
    )
      ? 30
      : 0;

    copyTallyLower['smallStraight'].clicked = true;
    setTallyLower(copyTallyLower);
    resetDice();
  };

  const largeStraight = () => {
    const copyTallyLower = { ...tallyLower };

    const reqs = [
      [1, 2, 3, 4, 5],
      [2, 3, 4, 5, 6],
    ];

    const nums = Object.keys(diceValues).map(Number);

    copyTallyLower['largeStraight'].val = reqs.some((arr) =>
      arr.every((num) => nums.includes(num))
    )
      ? 40
      : 0;

    copyTallyLower['largeStraight'].clicked = true;
    setTallyLower(copyTallyLower);
    resetDice();
  };

  const chance = () => {
    const copyTallyLower = { ...tallyLower };
    copyTallyLower['chance'].val = diceSum;
    copyTallyLower['chance'].clicked = true;
    setTallyLower(copyTallyLower);

    resetDice();
  };

  useEffect(() => {
    const upperTotal = Object.values(tallyUpper)
      .map((obj) => obj.val)
      .reduce((sum, num) => sum + num, 0);
    const lowerTotal = Object.values(tallyLower)
      .map((obj) => obj.val)
      .reduce((sum, num) => sum + num, 0);

    const bonus = upperTotal > 62 ? 35 : 0;
    setTotalScore(upperTotal + lowerTotal + bonus);
  }, [tallyUpper, tallyLower, setTotalScore]);

  useEffect(() => diceValueCounter(), [dice, diceValueCounter]);

  useEffect(() => {
    if (
      tallyUpper[1].clicked === true &&
      tallyUpper[2].clicked === true &&
      tallyUpper[3].clicked === true &&
      tallyUpper[4].clicked === true &&
      tallyUpper[5].clicked === true &&
      tallyUpper[6].clicked === true &&
      tallyLower['threeOfAKind'].clicked === true &&
      tallyLower['fourOfAKind'].clicked === true &&
      tallyLower['fullHouse'].clicked === true &&
      tallyLower['smallStraight'].clicked === true &&
      tallyLower['largeStraight'].clicked === true &&
      tallyLower['yahtzee'].clicked === true &&
      tallyLower['chance'].clicked === true
    ) {
      setIsGameover(true);
      resetDice();
    }
  }, [tallyUpper, tallyLower, isGameover, setIsGameover, resetDice]);

  return (
    <table>
      <thead>
        <tr>
          <th>Rule</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr
          className={tallyUpper[1].clicked ? 'clicked' : ''}
          onClick={() => upperPoints(1)}
        >
          <td>Ones</td>
          <td>{tallyUpper[1].clicked ? tallyUpper[1].val : '-'}</td>
        </tr>
        <tr
          className={tallyUpper[2].clicked ? 'clicked' : ''}
          onClick={() => upperPoints(2)}
        >
          <td>Twos</td>
          <td>{tallyUpper[2].clicked ? tallyUpper[2].val : '-'}</td>
        </tr>
        <tr
          className={tallyUpper[3].clicked ? 'clicked' : ''}
          onClick={() => upperPoints(3)}
        >
          <td>Threes</td>
          <td>{tallyUpper[3].clicked ? tallyUpper[3].val : '-'}</td>
        </tr>
        <tr
          className={tallyUpper[4].clicked ? 'clicked' : ''}
          onClick={() => upperPoints(4)}
        >
          <td>Fours</td>
          <td>{tallyUpper[4].clicked ? tallyUpper[4].val : '-'}</td>
        </tr>
        <tr
          className={tallyUpper[5].clicked ? 'clicked' : ''}
          onClick={() => upperPoints(5)}
        >
          <td>Fives</td>
          <td>{tallyUpper[5].clicked ? tallyUpper[5].val : '-'}</td>
        </tr>
        <tr
          className={tallyUpper[6].clicked ? 'clicked' : ''}
          onClick={() => upperPoints(6)}
        >
          <td>Sixes</td>
          <td>{tallyUpper[6].clicked ? tallyUpper[6].val : '-'}</td>
        </tr>
        <tr
          className={tallyLower['threeOfAKind'].clicked ? 'clicked' : ''}
          onClick={() => lowerPoints('threeOfAKind')}
        >
          <td>Three of a kind</td>
          <td>
            {tallyLower['threeOfAKind'].clicked
              ? tallyLower['threeOfAKind'].val
              : '-'}
          </td>
        </tr>
        <tr
          className={tallyLower['fourOfAKind'].clicked ? 'clicked' : ''}
          onClick={() => lowerPoints('fourOfAKind')}
        >
          <td>Four of a kind</td>
          <td>
            {tallyLower['fourOfAKind'].clicked
              ? tallyLower['fourOfAKind'].val
              : '-'}
          </td>
        </tr>
        <tr
          className={tallyLower['fullHouse'].clicked ? 'clicked' : ''}
          onClick={() => lowerPoints('fullHouse')}
        >
          <td>Full house</td>
          <td>
            {tallyLower['fullHouse'].clicked
              ? tallyLower['fullHouse'].val
              : '-'}
          </td>
        </tr>
        <tr
          className={tallyLower['smallStraight'].clicked ? 'clicked' : ''}
          onClick={() => lowerPoints('smallStraight')}
        >
          <td>Small straight</td>
          <td>
            {tallyLower['smallStraight'].clicked
              ? tallyLower['smallStraight'].val
              : '-'}
          </td>
        </tr>
        <tr
          className={tallyLower['largeStraight'].clicked ? 'clicked' : ''}
          onClick={() => lowerPoints('largeStraight')}
        >
          <td>Large straight</td>
          <td>
            {tallyLower['largeStraight'].clicked
              ? tallyLower['largeStraight'].val
              : '-'}
          </td>
        </tr>
        <tr
          className={tallyLower['yahtzee'].clicked ? 'clicked' : ''}
          onClick={() => lowerPoints('yahtzee')}
        >
          <td>Yahtzee</td>
          <td>
            {tallyLower['yahtzee'].clicked ? tallyLower['yahtzee'].val : '-'}
          </td>
        </tr>
        <tr
          className={tallyLower['chance'].clicked ? 'clicked' : ''}
          onClick={() => lowerPoints('chance')}
        >
          <td>Chance</td>
          <td>
            {tallyLower['chance'].clicked ? tallyLower['chance'].val : '-'}
          </td>
        </tr>
        <tr className='total-score'>
          <td>Total Score</td>
          <td>{totalScore}</td>
        </tr>
      </tbody>
    </table>
  );
};

RuleRows.propTypes = {
  dice: PropTypes.array,
  setDice: PropTypes.func,
  diceSum: PropTypes.number,
  rollsLeft: PropTypes.number,
  setRollsLeft: PropTypes.func,
};

export default RuleRows;
