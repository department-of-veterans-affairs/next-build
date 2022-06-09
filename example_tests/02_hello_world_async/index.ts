/**
 * Greet the caller, but asynchronously, to keep them on their toes.
 *
 * @param string name
 * @return string
 */
const printGreeting = (name: string): Promise<string> =>
  Promise.resolve(`Hello, ${name}!`)

export default printGreeting
