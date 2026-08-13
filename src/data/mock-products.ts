export type Product = {
  id: string
  name: string
  category: string
  price: number
}

export const products: Product[] = [
  { id: 'v1', name: 'Bạc xỉu đá', category: 'Cà phê', price: 28000 },
  { id: 'v2', name: 'Cà phê sữa', category: 'Cà phê', price: 32000 },
  { id: 'v3', name: 'Trà đào cam sả', category: 'Trà', price: 36000 },
  { id: 'v4', name: 'Sữa tươi chanh dây', category: 'Trà', price: 38000 },
  { id: 'v5', name: 'Matcha latte', category: 'Đá xay', price: 42000 },
  { id: 'v6', name: 'Khúc cú bắp', category: 'Đá xay', price: 39000 }
]
