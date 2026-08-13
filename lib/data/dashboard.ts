export const receiptSummary = { orderCount: 48, estimatedRevenue: 4820000 };

export const receipts = [
  { id: "1048", time: "09:35", items: 2, total: 75000, method: "Tiền mặt" },
  { id: "1047", time: "09:20", items: 3, total: 120000, method: "Chuyển khoản" },
  { id: "1046", time: "09:05", items: 1, total: 40000, method: "Tiền mặt" },
  { id: "1045", time: "08:45", items: 4, total: 165000, method: "Chuyển khoản" },
  { id: "1044", time: "08:12", items: 2, total: 80000, method: "Tiền mặt" }
];

export const revenueSummary = {
  revenue: 5600000,
  growth: 12,
  orderCount: 68,
  averageOrder: 82300,
  hourly: [
    { hour: "8h", value: 30 }, { hour: "10h", value: 70 }, { hour: "12h", value: 56 },
    { hour: "14h", value: 40 }, { hour: "16h", value: 86 }, { hour: "18h", value: 48 }
  ],
  topProducts: [
    { name: "Bạc xỉu", quantity: 42, revenue: "1.47M" },
    { name: "Latte", quantity: 35, revenue: "1.57M" },
    { name: "Trà đào", quantity: 28, revenue: "1.12M" }
  ]
};
