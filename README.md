# Taproot

Трекер задач и дерево навыков в стиле RPG. Прокачивай себя как персонажа: узлы дерева — это темы для изучения, задачи — шаги к их освоению.

## Стек
- Angular (standalone, Signals)
- SCSS
- localStorage (персист на старте)

## Архитектура
- Плоский Signal Store в `core/store`
- Рекурсивный рендер дерева через `SkillNodeComponent`
- Статусы узлов вычисляются через `computed`, не хранятся

## Запуск
```bash
npm install
ng serve
```

## GitFlow
 - main — стабильные релизы
 - develop — интеграция
 - feature/* — новые фичи
 - Коммиты — Conventional Commits