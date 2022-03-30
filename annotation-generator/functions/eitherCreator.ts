import eitherLeft from './eitherLeft';
import eitherRight from './eitherRight';

const eitherCreator = <T>(condition: boolean, rightVal: T, leftVal: T) => 
  condition ? eitherRight(rightVal) : eitherLeft(leftVal);

export default eitherCreator;