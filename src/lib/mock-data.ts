import type { ProductsResult, PlanResult } from "./api";

export function getMockProducts(style: string): ProductsResult {
  const byStyle: Record<string, ProductsResult["products"]> = {
    minimal: [
      { id: "p001", name: "Диван Loft двухместный", category: "furniture", price: 45000, currency: "KGS", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70", shop: "MebelCity", url: "#", priority: 1 },
      { id: "p002", name: "Кровать Milano 160×200", category: "furniture", price: 38000, currency: "KGS", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=70", shop: "HomeStyle", url: "#", priority: 1 },
      { id: "p004", name: "Подвесной светильник Bola", category: "lighting", price: 6200, currency: "KGS", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=70", shop: "LightShop KG", url: "#", priority: 2 },
      { id: "p005", name: "Краска стен Dulux — White Sand", category: "materials", price: 3800, currency: "KGS", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=70", shop: "StroiMarket", url: "#", priority: 1 },
      { id: "p006", name: "Ковёр хлопковый 160×230", category: "textile", price: 12000, currency: "KGS", image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&q=70", shop: "HomeStyle", url: "#", priority: 3 },
      { id: "p008", name: "Шторы льняные (2 панели)", category: "textile", price: 7200, currency: "KGS", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70", shop: "TextileHome", url: "#", priority: 2 },
    ],
    modern: [
      { id: "m001", name: "Диван Modern Arc серый", category: "furniture", price: 58000, currency: "KGS", image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=70", shop: "MebelCity", url: "#", priority: 1 },
      { id: "m002", name: "Журнальный стол Oval", category: "furniture", price: 14000, currency: "KGS", image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=400&q=70", shop: "HomeStyle", url: "#", priority: 2 },
      { id: "m003", name: "LED-лента подсветки 5м", category: "lighting", price: 2800, currency: "KGS", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70", shop: "LightShop KG", url: "#", priority: 2 },
      { id: "m004", name: "Краска Dulux — Anthracite", category: "materials", price: 4200, currency: "KGS", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=70", shop: "StroiMarket", url: "#", priority: 1 },
    ],
    scandi: [
      { id: "s001", name: "Стул Eames реплика дуб", category: "furniture", price: 9500, currency: "KGS", image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=70", shop: "ScandiHome", url: "#", priority: 1 },
      { id: "s002", name: "Полка настенная сосна", category: "furniture", price: 4800, currency: "KGS", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70", shop: "ScandiHome", url: "#", priority: 2 },
      { id: "p005", name: "Краска Dulux — Nordic White", category: "materials", price: 3800, currency: "KGS", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=70", shop: "StroiMarket", url: "#", priority: 1 },
    ],
  };

  const products = byStyle[style] ?? byStyle["minimal"];
  const total = products.reduce((sum, p) => sum + p.price, 0);

  return { style, budget: null, products, total_price: total, currency: "KGS", is_mock: true };
}

export function getMockPlan(designId: string): PlanResult {
  return {
    design_id: designId,
    total_weeks: 3,
    total_cost: 88000,
    currency: "KGS",
    is_mock: true,
    weeks: [
      {
        week: 1, title: "Подготовка и стены", icon: "🖌️",
        estimated_cost: 8000, currency: "KGS",
        tasks: ["Освободить комнату от старой мебели", "Зашпаклевать трещины и неровности", "Покрасить стены в выбранный цвет", "Покрасить потолок"],
      },
      {
        week: 2, title: "Мебель и освещение", icon: "🛋️",
        estimated_cost: 65000, currency: "KGS",
        tasks: ["Доставить и собрать основную мебель", "Установить подвесное освещение", "Настроить LED-подсветку (если есть)", "Повесить зеркала и полки"],
      },
      {
        week: 3, title: "Декор и финальные штрихи", icon: "✨",
        estimated_cost: 15000, currency: "KGS",
        tasks: ["Повесить шторы", "Расстелить ковёр", "Расставить декор и растения", "Финальная уборка и фото результата"],
      },
    ],
  };
}
