import { Button } from "@/components/ui/Button";

type QuantityControlProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantityControl({
  quantity,
  onDecrease,
  onIncrease
}: QuantityControlProps) {
  return (
    <div className="vp-qty-control" role="group" aria-label="Điều chỉnh số lượng">
      <Button variant="secondary" type="button" onClick={onDecrease} aria-label="Giảm">
        -
      </Button>
      <span className="vp-caption">{quantity}</span>
      <Button variant="secondary" type="button" onClick={onIncrease} aria-label="Tăng">
        +
      </Button>
    </div>
  );
}
