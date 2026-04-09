# Документування ПЗ

У репозиторії є матеріали для лабораторних робіт по темі Amazon marketplace.

## Лабораторна 1

Діаграми з першої лабораторної лежать у папці `code/`:
- `Use_Case_diagram.puml`
- `class_diagram.puml`
- `activity_diagram.puml`
- `sequence_diagram.puml`

## Лабораторна 2

Серверна частина реалізована на `NestJS` з трирівневою архітектурою:
- `data access` - TypeORM + SQLite через `sql.js`, CSV reader, репозиторії
- `business` - імпорт, валідація, дедуплікація, статистика
- `presentation` - REST endpoints і Swagger

## Лабораторна 3

На основі шаблону MVC додано веб-додаток, який візуалізує основну сутність предметної області - `Product`.

Реалізовано:
- список товарів у вигляді HTML-сторінки
- створення товару
- редагування товару
- видалення товару
- server-side rendering через `hbs`
- читання даних через бізнес-логіку, а не напряму з контролера в БД

## Архітектура

### Основна сутність
- `Product`

### Шари
- `data access` - сутності, ORM, робота з SQLite, репозиторії
- `business` - сервіси для імпорту і MVC CRUD-логіки
- `presentation` - REST controllers і MVC controllers

### Ключові частини
- імпорт CSV: `src/business/services/amazon-marketplace-import.service.ts`
- CRUD для MVC: `src/business/services/product-mvc.service.ts`
- CSV reader: `src/data-access/csv/amazon-marketplace-csv.reader.ts`
- TypeORM-репозиторії: `src/data-access/repositories/`
- MVC controller: `src/presentation/controllers/products.controller.ts`
- REST controllers: `src/presentation/controllers/imports.controller.ts`, `src/presentation/controllers/data.controller.ts`
- views: `src/presentation/views/products/`

## Встановлення

Передумови:
- встановлений Node.js

Встановити залежності:

```powershell
npm install
```

## Основні команди

```powershell
npm run typecheck
npm run build
npm run start
npm run start:dev
npm run start:prod
```

## Дані для лабораторних

### Згенерувати CSV

```powershell
npm run generate:csv -- --output data/amazon_marketplace_seed.csv --rows 1200
```

Очікувано:
- створюється `data/amazon_marketplace_seed.csv`
- у файлі мінімум 1000 рядків

### Імпортувати CSV у базу

```powershell
npm run import:csv -- --csv data/amazon_marketplace_seed.csv
```

Очікувано:
- створюється або оновлюється `data/amazon-marketplace.sqlite`
- у консолі повертається summary імпорту

## Запуск веб-додатку

### Стандартний запуск

```powershell
npm run start
```

Якщо порт `3000` зайнятий:

```powershell
cmd /c "set PORT=3001 && npm run start"
```

### Після запуску

REST / Swagger:
- `http://localhost:3000/docs`
- `http://localhost:3000/imports/stats`

MVC:
- `http://localhost:3000/products`

Якщо запускав на `3001`, тоді просто заміни порт у URL.

## Що перевіряти для лабораторної 3

### Головна MVC-сторінка товарів
- `GET /products`

Що має бути:
- HTML-таблиця зі списком товарів
- кнопка `Add Product`
- кнопки `Edit` і `Delete` біля кожного товару

### Створення товару
- `GET /products/create`
- `POST /products/create`

Що має бути:
- форма створення товару
- після submit товар з'являється в списку

### Редагування товару
- `GET /products/:id/edit`
- `POST /products/:id/edit`

Що має бути:
- форма редагування з поточними даними товару
- після submit зміни видно в таблиці

### Видалення товару
- `POST /products/:id/delete`

Що має бути:
- товар зникає зі списку

## REST endpoints з лабораторної 2

### Імпорт і статистика
- `POST /imports/load`
- `POST /imports/upload`
- `GET /imports/stats`

### Дані таблиць
- `GET /data/categories`
- `GET /data/sellers`
- `GET /data/products`
- `GET /data/listings`
- `GET /data/customers`
- `GET /data/orders`
- `GET /data/order-items`
- `GET /data/shipments`

## Команди для швидкої перевірки через термінал

### Статистика

```powershell
curl http://localhost:3000/imports/stats
```

### Список товарів через REST

```powershell
curl http://localhost:3000/data/products
```

### HTML-сторінка товарів

```powershell
curl http://localhost:3000/products
```

### Якщо сервер на 3001

```powershell
curl http://localhost:3001/imports/stats
curl http://localhost:3001/data/products
curl http://localhost:3001/products
```

## Що вже перевірено

Було перевірено:
- `npm run typecheck`
- `npm run build`
- `npm run generate:csv -- --output data/amazon_marketplace_seed.csv --rows 1200`
- `npm run import:csv -- --csv data/amazon_marketplace_seed.csv`
- REST endpoints зі статистикою і даними таблиць
- MVC-сторінка `/products`
- створення нового товару через MVC-форму
- видалення тестових товарів після перевірки

## Що показати на захисті

Для лабораторної 3 найзручніше показати:
- `GET /products`
- `GET /products/create`
- створення товару
- `GET /products/:id/edit`
- редагування товару
- видалення товару

Із коду:
- `src/presentation/controllers/products.controller.ts`
- `src/business/services/product-mvc.service.ts`
- `src/data-access/repositories/typeorm-catalog.repository.ts`
- `src/presentation/views/products/index.hbs`
- `src/presentation/views/products/form.hbs`