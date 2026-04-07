# landing-nyambot

Лендинг Nyambot — презентация продукта, тарифы, демо.

## Стек

- Next.js 15, React 19, TypeScript
- Ant Design, Tailwind CSS 4, Framer Motion
- Zustand, i18next (7 языков)
- Порт: 3200

## Quality Gates

```bash
npm run lint:fix && npm run lint && npm run format && npm run type-check
```

## Ключевые особенности

- CSS-переменные для темы (bridge из miniapp)
- Framer Motion: ease как массив, не строка
- Pricing в рублях
- Яндекс.Метрика goals
- MAX первый в порядке мессенджеров
- i18n: 7 языков, статическая генерация

## Правила

- Все правила: `workspace-scripts/.project-meta/RULES.md`
- Ответы на русском языке
