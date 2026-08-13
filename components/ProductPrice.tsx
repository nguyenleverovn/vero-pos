export function ProductPrice({ amount }: { amount: number }) {
  return <p className="vp-price">{amount / 1000}k</p>;
}
