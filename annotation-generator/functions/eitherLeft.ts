import { Either } from 'monet';

const eitherLeft = <T>(val: T) => Either.left<T, T>(val);

export default eitherLeft;