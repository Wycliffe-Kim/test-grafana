import { Either } from 'monet';

const eitherRight = <T>(val: T) => Either.right<T, T>(val);

export default eitherRight;