import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
} from '@fortawesome/free-solid-svg-icons';

const Die = ({ val, isLocked, changeLocked, id }) => {
  const showDie = () => {
    switch (val) {
      case 1:
        return <FontAwesomeIcon icon={faDiceOne} />;
      case 2:
        return <FontAwesomeIcon icon={faDiceTwo} />;
      case 3:
        return <FontAwesomeIcon icon={faDiceThree} />;
      case 4:
        return <FontAwesomeIcon icon={faDiceFour} />;
      case 5:
        return <FontAwesomeIcon icon={faDiceFive} />;
      case 6:
        return <FontAwesomeIcon icon={faDiceSix} />;
    }
  };

  return (
    <div
      className={isLocked ? 'die-disabled' : 'die'}
      onClick={() => changeLocked(id)}
    >
      {showDie()}
    </div>
  );
};

const { number, bool, func } = PropTypes;

Die.propTypes = {
  val: number,
  isLocked: bool,
  changeLocked: func,
  id: number,
};

Die.defaultProp = {
  val: 6,
  isLocked: false,
};

export default Die;
