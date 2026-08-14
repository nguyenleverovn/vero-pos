"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadOrderById, PosOrder } from "@/lib/repositories/orderRepository";

interface ReceiptDetailPageProps {
  params: {
    id: string;
  };
}

export default function ReceiptDetailPage({ params }: ReceiptDetailPageProps) {
  const [order, setOrder] = useState<PosOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    loadOrderById(params.id).then((loadedOrder) => {
      if (!cancelled) {
        setOrder(loadedOrder);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [params.id]);

  if (loading) {
    return (
      <main className="vp-screen vp-screen--plain">
        <header className="vp-screen-heading"><h1>Chi tiết Hóa đơn</h1></header>
        <p className="vp-menu-empty">Đang tải...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="vp-screen vp-screen--plain">
        <header className="vp-screen-heading"><h1>Chi tiết Hóa đơn</h1></header>
        <div className="vp-menu-empty">Không tìm thấy hóa đơn.</div>
        <Link className="vp-fab" href="/receipts">← Quay lại</Link>
      </main>
    );
  }

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const createdDate = new Date(order.createdAt);
  const formattedDate = createdDate.toLocaleDateString("vi-VN");
  const formattedTime = createdDate.toLocaleTimeString("vi-VN");
  const paymentMethodLabel = order.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản";

  return (
    <main className="vp-screen vp-screen--plain">
      <header className="vp-screen-heading">
        <h1>Chi tiết Hóa đơn</h1>
        <Link href="/receipts">← Quay lại</Link>
      </header>

      <section className="vp-receipt-detail">
        <div className="vp-receipt-detail-header">
          <div className="vp-receipt-info-row">
            <span className="vp-receipt-label">Mã hóa đơn</span>
            <strong className="vp-receipt-value">#{order.orderNumber}</strong>
          </div>
          <div className="vp-receipt-info-row">
            <span className="vp-receipt-label">ID</span>
            <span className="vp-receipt-value vp-receipt-id">{order.id.slice(0, 8)}</span>
          </div>
          <div className="vp-receipt-info-row">
            <span className="vp-receipt-label">Ngày giờ</span>
            <span className="vp-receipt-value">{formattedDate} {formattedTime}</span>
          </div>
          <div className="vp-receipt-info-row">
            <span className="vp-receipt-label">Hình thức thanh toán</span>
            <span className="vp-receipt-value">{paymentMethodLabel}</span>
          </div>
        </div>

        <div className="vp-receipt-items">
          <h2>Chi tiết các món</h2>
          <table className="vp-receipt-items-table">
            <thead>
              <tr>
                <th>Tên món</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td className="vp-text-center">{item.quantity}</td>
                  <td className="vp-text-right">{item.priceVnd.toLocaleString("vi-VN")}đ</td>
                  <td className="vp-text-right">
                    <strong>{(item.priceVnd * item.quantity).toLocaleString("vi-VN")}đ</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="vp-receipt-summary">
          <div className="vp-receipt-summary-row">
            <span>Tổng số món</span>
            <strong>{totalItems} món</strong>
          </div>
          <div className="vp-receipt-summary-row vp-receipt-summary-total">
            <span>Tổng cộng</span>
            <strong className="vp-receipt-total-amount">
              {order.totalVnd.toLocaleString("vi-VN")}đ
            </strong>
          </div>
        </div>
      </section>

      <style jsx>{`
        .vp-receipt-detail {
          padding: 1rem;
          background: white;
        }

        .vp-receipt-detail-header {
          border-bottom: 1px solid #d3ddff;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .vp-receipt-info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.875rem;
        }

        .vp-receipt-label {
          color: #51608d;
        }

        .vp-receipt-value {
          color: #0f1d3a;
          font-weight: 500;
        }

        .vp-receipt-id {
          font-family: monospace;
          font-size: 0.8rem;
        }

        .vp-receipt-items {
          margin: 1.5rem 0;
        }

        .vp-receipt-items h2 {
          font-size: 1rem;
          margin-bottom: 0.75rem;
          color: #0f1d3a;
        }

        .vp-receipt-items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .vp-receipt-items-table thead {
          background-color: #f8f9fc;
          border-bottom: 1px solid #d3ddff;
        }

        .vp-receipt-items-table th {
          padding: 0.5rem;
          text-align: left;
          font-weight: 600;
          color: #0f1d3a;
        }

        .vp-receipt-items-table td {
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid #d3ddff;
          color: #0f1d3a;
        }

        .vp-text-center {
          text-align: center;
        }

        .vp-text-right {
          text-align: right;
        }

        .vp-receipt-summary {
          border-top: 2px solid #d3ddff;
          padding-top: 1rem;
          margin-top: 1rem;
        }

        .vp-receipt-summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.9rem;
        }

        .vp-receipt-summary-total {
          font-size: 1.1rem;
          font-weight: 600;
          color: #0f1d3a;
          padding-top: 0.75rem;
        }

        .vp-receipt-total-amount {
          color: #f5a524;
          font-size: 1.25rem;
        }
      `}</style>
    </main>
  );
}
