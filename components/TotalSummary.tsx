type TotalSummaryProps = {
  subtotal: number;
};

export function TotalSummary({ subtotal }: TotalSummaryProps) {
  return (
    <div className="vp-total">
      <div>
        <p className="vp-caption">Tạm tính</p>
        <p className="vp-body-bold">₫ {subtotal.toLocaleString("vi-VN")}</p>
      </div>
      <div>
        <p className="vp-caption">Tổng cộng</p>
        <p className="vp-title">₫ {subtotal.toLocaleString("vi-VN")}</p>
      </div>
    </div>
  );
}
