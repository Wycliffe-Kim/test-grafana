
const withLog = <T>(f: () => T, message: string): T => {
  console.log(message);
  return f();
};

export default withLog;