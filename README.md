# Документування ПЗ

У цьому репозиторії:
- `code/` - діаграми з лабораторної 1
- `src/` - серверна частина лабораторної 2 на `NestJS`
- `data/` - CSV-файл і SQLite-база для лабораторної 2

## Коротко що тут до чого

Лабораторна 2 зроблена як 3-рівнева архітектура:
- `data access` - робота з БД, ORM-сутності, CSV reader, файлове сховище для upload
- `business` - імпорт CSV, валідація, створення/перевикористання моделей, статистика
- `presentation` - REST endpoints і Swagger, без бізнес-логіки

Основні модулі:
- `src/app.module.ts`
- `src/data-access/data-access.module.ts`
- `src/business/business.module.ts`
- `src/presentation/presentation.module.ts`

Ключові файли:
- імпорт CSV: `src/business/services/amazon-marketplace-import.service.ts`
- статистика і читання даних: `src/business/services/amazon-marketplace-query.service.ts`
- CSV reader: `src/data-access/csv/amazon-marketplace-csv.reader.ts`
- генератор CSV: `src/cli/amazon-csv.generator.ts`
- CLI імпорт: `src/cli/import-amazon-csv.ts`

## Що саме реалізовано

- `NestJS` сервер
- `TypeORM`
- `SQLite` через `sql.js`
- окремий модуль генерації CSV на 1000+ рядків
- окремий CLI-імпорт CSV у базу
- Swagger UI
- endpoints для перегляду таблиць
- upload CSV через Swagger
- інтерфейси репозиторіїв і DI через токени

## Швидкий сценарій перевірки

### 1. Встановити залежності

```powershell
npm install
```

Що має бути:
- встановляться `node_modules`
- з'явиться `package-lock.json`
- без помилок `npm ERR!`

### 2. Перевірити типи

```powershell
npm run typecheck
```

Що має бути:
- команда завершується без помилок
- якщо все добре, TypeScript нічого не ламає

### 3. Зібрати проєкт

```powershell
npm run build
```

Що має бути:
- створиться папка `dist/`
- в консолі буде успішна збірка без error

### 4. Згенерувати CSV-файл

```powershell
npm run generate:csv -- --output data/amazon_marketplace_seed.csv --rows 1200
```

Що має бути:
- створиться або оновиться файл `data/amazon_marketplace_seed.csv`
- в консолі буде щось типу:
  - `CSV file generated: ...`
  - `Rows written: 1200`

### 5. Імпортувати CSV у SQLite

```powershell
npm run import:csv -- --csv data/amazon_marketplace_seed.csv
```

Що має бути:
- створиться або оновиться файл `data/amazon-marketplace.sqlite`
- в консолі буде summary імпорту
- для чистого імпорту очікувано приблизно так:
  - `processedRows: 1200`
  - `createdCategoryPaths: 14`
  - `createdSellers: 60`
  - `createdProducts: 80`
  - `createdListings: 240`
  - `createdCustomers: 250`
  - `createdOrders: 600`
  - `createdOrderItems: 1200`
  - `upsertedShipments: 600`

Примітка:
- якщо запускати імпорт другий раз на ту ж саму базу, частина записів не створюватиметься заново, бо є дедуплікація

### 6. Запустити сервер

```powershell
npm run start
```

Що має бути:
- сервер стартує на `http://localhost:3000`
- Swagger буде на `http://localhost:3000/docs`

Якщо `3000` зайнятий:

```powershell
cmd /c "set PORT=3001 && npm run start"
```

Тоді перевіряти тут:
- `http://localhost:3001/docs`

## Що перевіряти в браузері / Swagger

### Swagger
- `GET /imports/stats`
- `POST /imports/load`
- `POST /imports/upload`
- `GET /data/categories`
- `GET /data/sellers`
- `GET /data/products`
- `GET /data/listings`
- `GET /data/customers`
- `GET /data/orders`
- `GET /data/order-items`
- `GET /data/shipments`

### Що має показувати
- `GET /imports/stats` - кількість записів у таблицях
- `GET /data/products` - список товарів
- `GET /data/orders` - список замовлень
- `GET /data/shipments` - список доставок

## Як тестити через термінал після запуску сервера

### Якщо сервер на 3000

```powershell
curl http://localhost:3000/imports/stats
curl http://localhost:3000/data/products
curl http://localhost:3000/data/orders
```

### Якщо сервер на 3001

```powershell
curl http://localhost:3001/imports/stats
curl http://localhost:3001/data/products
curl http://localhost:3001/data/orders
```

Очікування:
- HTTP `200 OK`
- `/imports/stats` повертає JSON зі статистикою таблиць
- `/data/products` повертає JSON-масив товарів
- `/data/orders` повертає JSON-масив замовлень

## Як протестити імпорт через HTTP

### Варіант 1. Імпорт із шляху до файла

Endpoint:
- `POST /imports/load`

Body:

```json
{
  "csvPath": "data/amazon_marketplace_seed.csv"
}
```

Що має бути:
- повертається summary імпорту у JSON

### Варіант 2. Імпорт через upload

Через Swagger:
- відкрити `/docs`
- знайти `POST /imports/upload`
- вибрати `.csv`
- натиснути `Execute`

Що має бути:
- файл тимчасово збережеться
- імпорт відпрацює
- повернеться summary у JSON

## Файли, які варто показати викладачу

- `src/app.module.ts`
- `src/data-access/data-access.module.ts`
- `src/business/interfaces/`
- `src/business/services/amazon-marketplace-import.service.ts`
- `src/data-access/entities/`
- `src/presentation/controllers/imports.controller.ts`
- `src/cli/generate-amazon-csv.ts`
- `src/cli/import-amazon-csv.ts`

## Готові дані в репозиторії

Уже є:
- `data/amazon_marketplace_seed.csv`
- `data/amazon-marketplace.sqlite`

Тобто якщо хочеш, можеш одразу:
1. `npm install`
2. `npm run start`
3. зайти в Swagger
4. перевірити `GET /imports/stats`

## Що вже було перевірено

Було перевірено локально:
- `npm run typecheck`
- `npm run build`
- `npm run generate:csv -- --output data/amazon_marketplace_seed.csv --rows 1200`
- `npm run import:csv -- --csv data/amazon_marketplace_seed.csv`
- запуск сервера на `3001`
- `GET /imports/stats` -> `200 OK`
- `GET /data/products` -> `200 OK`
- `GET /docs` -> `200 OK`

## Якщо щось не запускається

Перевір по черзі:
- чи встановлений `Node.js`
- чи виконаний `npm install`
- чи не зайнятий порт `3000`
- чи існує `data/amazon_marketplace_seed.csv`
- чи немає помилок у консолі при `npm run start`

Найчастіший варіант:
- `3000` зайнятий, тоді просто запускай через `PORT=3001`