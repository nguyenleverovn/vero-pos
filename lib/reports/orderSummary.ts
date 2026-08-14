import { PosOrder } from "@/lib/repositories/orderRepository";

export type SummaryPeriod = "day" | "month" | "year";

export type OrderSummary = {
  label: string;
  revenue: number;
  orderCount: number;
  averageOrder: number;
  growthPercent: number | null;
  timeline: Array<{ label: string; revenue: number; height: number }>;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
};

function startOfPeriod(period: SummaryPeriod, date: Date) {
  if (period === "day") return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (period === "month") return new Date(date.getFullYear(), date.getMonth(), 1);
  return new Date(date.getFullYear(), 0, 1);
}

function nextPeriod(period: SummaryPeriod, start: Date) {
  if (period === "day") return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
  if (period === "month") return new Date(start.getFullYear(), start.getMonth() + 1, 1);
  return new Date(start.getFullYear() + 1, 0, 1);
}

function previousPeriod(period: SummaryPeriod, start: Date) {
  if (period === "day") return new Date(start.getFullYear(), start.getMonth(), start.getDate() - 1);
  if (period === "month") return new Date(start.getFullYear(), start.getMonth() - 1, 1);
  return new Date(start.getFullYear() - 1, 0, 1);
}

function periodLabel(period: SummaryPeriod, now: Date) {
  if (period === "day") return `Ngày ${now.toLocaleDateString("vi-VN")}`;
  if (period === "month") return `Tháng ${now.getMonth() + 1}/${now.getFullYear()}`;
  return `Năm ${now.getFullYear()}`;
}

function timelineFor(period: SummaryPeriod, orders: PosOrder[], start: Date) {
  const count = period === "year" ? 12 : period === "month" ? 7 : 6;
  const values = Array.from({ length: count }, () => 0);

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const index = period === "day"
      ? Math.floor(date.getHours() / 4)
      : period === "month"
        ? Math.min(6, Math.floor((date.getDate() - 1) / 5))
        : date.getMonth();
    values[index] += order.totalVnd;
  });

  const maximum = Math.max(...values, 1);

  return values.map((revenue, index) => ({
    label: period === "day" ? `${index * 4}h` : period === "month" ? `${index * 5 + 1}` : `T${index + 1}`,
    revenue: values[index],
    height: revenue === 0 ? 4 : Math.max(12, Math.round(revenue / maximum * 100))
  }));
}

function topProductsFor(orders: PosOrder[]) {
  const products = new Map<string, { name: string; quantity: number; revenue: number }>();

  orders.forEach((order) => order.items.forEach((item) => {
    const current = products.get(item.productId) ?? { name: item.name, quantity: 0, revenue: 0 };
    current.quantity += item.quantity;
    current.revenue += item.priceVnd * item.quantity;
    products.set(item.productId, current);
  }));

  return Array.from(products.values())
    .sort((left, right) => right.quantity - left.quantity)
    .slice(0, 5);
}

export function summarizeOrders(orders: PosOrder[], period: SummaryPeriod, now = new Date()): OrderSummary {
  const start = startOfPeriod(period, now);
  const end = nextPeriod(period, start);
  const previousStart = previousPeriod(period, start);
  const currentOrders = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= start && createdAt < end;
  });
  const previousOrders = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= previousStart && createdAt < start;
  });
  const revenue = currentOrders.reduce((sum, order) => sum + order.totalVnd, 0);
  const previousRevenue = previousOrders.reduce((sum, order) => sum + order.totalVnd, 0);

  return {
    label: periodLabel(period, now),
    revenue,
    orderCount: currentOrders.length,
    averageOrder: currentOrders.length > 0 ? Math.round(revenue / currentOrders.length) : 0,
    growthPercent: previousRevenue > 0 ? Math.round((revenue - previousRevenue) / previousRevenue * 100) : null,
    timeline: timelineFor(period, currentOrders, start),
    topProducts: topProductsFor(currentOrders)
  };
}

export function summarizeOrdersInRange(orders: PosOrder[], rangeStart: Date, rangeEnd: Date): OrderSummary {
  const start = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
  const end = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate() + 1);
  const selectedOrders = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= start && createdAt < end;
  });
  const revenue = selectedOrders.reduce((sum, order) => sum + order.totalVnd, 0);
  const dayCount = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000));
  const bucketCount = Math.min(dayCount, 14);
  const values = Array.from({ length: bucketCount }, () => 0);

  selectedOrders.forEach((order) => {
    const dayOffset = Math.max(0, Math.floor((new Date(order.createdAt).getTime() - start.getTime()) / 86_400_000));
    const index = Math.min(bucketCount - 1, Math.floor(dayOffset / dayCount * bucketCount));
    values[index] += order.totalVnd;
  });

  const maximum = Math.max(...values, 1);
  const timeline = values.map((value, index) => {
    const bucketDate = new Date(start);
    bucketDate.setDate(start.getDate() + Math.floor(index * dayCount / bucketCount));
    return {
      label: bucketDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
      revenue: value,
      height: value === 0 ? 4 : Math.max(12, Math.round(value / maximum * 100))
    };
  });

  return {
    label: `${start.toLocaleDateString("vi-VN")} - ${rangeEnd.toLocaleDateString("vi-VN")}`,
    revenue,
    orderCount: selectedOrders.length,
    averageOrder: selectedOrders.length > 0 ? Math.round(revenue / selectedOrders.length) : 0,
    growthPercent: null,
    timeline,
    topProducts: topProductsFor(selectedOrders)
  };
}
