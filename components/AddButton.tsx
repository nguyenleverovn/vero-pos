import { Button } from "@/components/ui/Button";

type AddButtonProps = {
  onClick: () => void;
};

export function AddButton({ onClick }: AddButtonProps) {
  return (
    <Button variant="primary" type="button" onClick={onClick}>
      + Thêm
    </Button>
  );
}
