export type Dictionary = {
  nav: { design: string; gallery: string; aiChat: string; profile: string };
  upload: {
    title: string; subtitle: string; dropzoneTitle: string;
    dropzoneHint: string; cta: string; ctaLoading: string; hint: string;
    trySample: string; styleTitle: string;
    preferences: string; preferencesPlaceholder: string;
  };
  style: {
    title: string; subtitle: string; trending: string;
    aiStylist: string; aiStylistDesc: string; aiStylistCta: string;
  };
  result: {
    title: string; mockNotice: string; shoppingList: string; renoPlan: string;
    totalBudget: string; buy: string; weeksTotal: string; week: string;
    askAi: string; download: string;
  };
  gallery: { title: string; subtitle: string; empty: string; emptyHint: string };
  chat: {
    title: string; subtitle: string; placeholder: string; send: string;
    newChat: string; historyTitle: string; noHistory: string;
  };
  profile: {
    title: string; subtitle: string;
    designs: string; plan: string; free: string; premium: string;
    upgradeCta: string; upgradeDesc: string;
    settings: string; language: string; languageNote: string;
    budget: string; budgetEconomy: string; budgetMedium: string; budgetPremium: string;
    about: string; version: string; feedback: string;
    editProfile: string;
  };
  common: { comingSoon: string; before: string; after: string; style: string };
};

const ru: Dictionary = {
  nav: {
    design: "Дизайн",
    gallery: "Галерея",
    aiChat: "AI Чат",
    profile: "Профиль",
  },
  upload: {
    title: "Загрузить комнату",
    subtitle: "Наш AI проанализирует пространство и применит выбранный стиль.",
    dropzoneTitle: "Загрузите фото комнаты",
    dropzoneHint: "Нажмите или перетащите файл",
    cta: "Переделать комнату",
    ctaLoading: "Анализируем комнату...",
    hint: "Загрузите фото, чтобы начать",
    trySample: "Попробовать пример",
    styleTitle: "Стиль оформления",
    preferences: "Пожелания (необязательно)",
    preferencesPlaceholder: "Например: больше света, тёплые тона, минимум мебели...",
  },
  style: {
    title: "Выберите стиль",
    subtitle: "Выберите основу для вашего интерьера с AI.",
    trending: "ПОПУЛЯРНО",
    aiStylist: "AI Стилист",
    aiStylistDesc: "Проанализируем ваше пространство и автоматически подберём идеальный стиль.",
    aiStylistCta: "Начать анализ",
  },
  result: {
    title: "Ваш редизайн",
    mockNotice: "Предпросмотр — добавьте Replicate ключ для реального AI",
    shoppingList: "Список покупок",
    renoPlan: "План ремонта",
    totalBudget: "Итого",
    buy: "Купить",
    weeksTotal: "нед. всего",
    week: "Неделя",
    askAi: "Спросить AI об этом дизайне",
    download: "Скачать дизайн",
  },
  gallery: {
    title: "Галерея",
    subtitle: "Ваши сохранённые редизайны.",
    empty: "Ещё нет редизайнов",
    emptyHint: "Загрузите фото комнаты и создайте первый дизайн",
  },
  chat: {
    title: "AI Чат",
    subtitle: "Задайте любой вопрос о ремонте.",
    placeholder: "Спросите что-нибудь...",
    send: "Отправить",
    newChat: "Новый чат",
    historyTitle: "История бесед",
    noHistory: "Пока нет бесед",
  },
  profile: {
    title: "Профиль",
    subtitle: "Управляйте аккаунтом и планом.",
    designs: "редизайнов",
    plan: "Тариф",
    free: "Бесплатно",
    premium: "Premium",
    upgradeCta: "Перейти на Premium",
    upgradeDesc: "Больше дизайнов, точная смета и 3D-планировка",
    settings: "Настройки",
    language: "Язык",
    languageNote: "Смена языка через /ru и /en в адресе",
    budget: "Бюджет по умолчанию",
    budgetEconomy: "Эконом",
    budgetMedium: "Средний",
    budgetPremium: "Премиум",
    about: "О приложении",
    version: "Версия",
    feedback: "Написать отзыв",
    editProfile: "Редактировать",
  },
  common: {
    comingSoon: "Скоро",
    before: "До",
    after: "После",
    style: "стиль",
  },
};

export default ru;
