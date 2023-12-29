// opt-out of next.js image optimization, no-op
export default function customLoader({ src }) {
  return src
}
