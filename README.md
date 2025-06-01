# Naraphip

โปรเจค e-commerce application ที่ทำขึ้นเพื่อ Challenge

1. ระบบรับเงิน:
- ต้องรองรับเหรียญ 1, 5, 10 บาท และธนบัตร 20, 50, 100, 500, 1,000 บาท

2. เลือกรายการสินค้า:
- ผู้ใช้สามารถเลือกซื้อสินค้าได้จากสินค้าที่มีอยู่ใน stock

3. การคำนวณและตรวจสอบ:

- ตรวจสอบว่าจ่ายเงินพอหรือไม่

- ตรวจสอบว่ามีเงินทอนพอหรือไม่

- คำนวณว่าจะทอนเป็น เหรียญหรือธนบัตรอะไรบ้าง (ใช้ algorithm เอง)

- สินค้ามีเหลืออยู่หรือไม่

4. อัปเดตระบบ:

- ปรับจำนวนเหรียญ/ธนบัตรในเครื่องตามที่รับเงินเข้ามาและให้เงินทอนออกไป

- ปรับ stock สินค้าตามการซื้อ

## โครงสร้างโปรเจค

```
bluepishop/
├── README.md
├── docker-compose.yml      # Docker configuration
├── backend/               # CodeIgniter 4 Backend
│   └── app/
│       └── Models/
│           └── Schema/    # Database Schema Files
│               ├── Products.sql
│               ├── Transactions.sql
│               ├── PaymentStatus.sql
│               └── Cash.sql
├── client/                # Next.js Frontend
│   └── Dockerfile         # Frontend Docker image
└── docker/               # Docker configurations
    ├── php/
    │   └── Dockerfile     # PHP Apache configuration
    ├── apache/
    │   └── 000-default.conf
    └── mysql/
        └── init.sql       # Database initialization
```

## เทคโนโลยีที่ใช้

- **Frontend**: Next.js (React Framework)
- **Backend**: CodeIgniter 4 (PHP Framework)
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose

## การติดตั้งและรัน

### ข้อกำหนดเบื้องต้น

- Docker และ Docker Compose
- Node.js (สำหรับ frontend development)
- PHP 8.x (สำหรับ backend development)

### การรันด้วย Docker Compose (แนะนำ)

1. Clone repository:
```bash
git clone [repository-url]
cd bluepishop
```

2. ตั้งค่า environment variables:
```bash
cp .env.development .env
# แก้ไขค่าต่างๆ ใน .env ตามต้องการ
```

3. Build และรันแอปพลิเคชัน:
```bash
docker-compose up --build -d
```

4. ตรวจสอบ containers:
```bash
docker-compose ps
docker-compose logs
```

5. เข้าใช้งานแอปพลิเคชัน:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api (แนะนำ postman)
- Database: localhost:3306 (MySQL)

### การรันแบบ Development

#### Backend (CodeIgniter 4)
```bash
cd backend
# ติดตั้ง dependencies ด้วย Composer
composer install

# Copy environment file
cp env .env
# แก้ไขค่าตัวแปรใน .env สำหรับ database connection

# รัน CodeIgniter development server
php spark serve --host=0.0.0.0 --port=8080
```

#### Client (Next.js)
```bash
cd client
npm install
npm run dev
```

## Docker Configuration

โปรเจคใช้ multi-container setup ด้วย Docker Compose:

### Services

1. **Frontend (Next.js)**
   - Port: 3000
   - Built from: `client/Dockerfile`
   - Node.js 20 Alpine

2. **Backend (CodeIgniter 4)**
   - Port: 8080 (Apache)
   - Built from: `docker/php/Dockerfile`  
   - PHP 8.1 with Apache
   - Extensions: intl, mysqli
   - Mod rewrite enabled

3. **Database (MySQL 8.0)**
   - Port: 3306
   - Auto-initialize with `docker/mysql/init.sql`
   - Volume: `db_data` for persistence

### Dockerfile Details

**Frontend** (`client/Dockerfile`):
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

**Backend** (`docker/php/Dockerfile`):
```dockerfile
FROM php:8.1-apache
RUN apt-get update && apt-get install -y libicu-dev \
    && docker-php-ext-install intl mysqli \
    && a2enmod rewrite headers
COPY . /var/www/html
WORKDIR /var/www/html
```

## Database Schema

โปรเจคใช้ MySQL database โดยมี schema หลักดังนี้:

### Auto-Initialization

Database จะถูก initialize อัตโนมัติผ่าน `docker/mysql/init.sql` เมื่อรัน container ครั้งแรก

### Tables Structure

1. **products** - ข้อมูลสินค้า
2. **transactions** - รายการธุรกรรม
3. **payment_status** - สถานะการชำระเงิน  
4. **cash** - ข้อมูลเงินสด

### การเตรียม Schema Files

**วิธีที่ 1: รวมไฟล์เป็นไฟล์เดียว**
```bash
cat backend/app/Models/Schema/*.sql > docker/mysql/init.sql
```

**วิธีที่ 2: แก้ไข docker-compose.yml**
```yaml
volumes:
  - ./backend/app/Models/Schema:/docker-entrypoint-initdb.d
```

### Manual Database Import (หากจำเป็น)

```bash
# Import ทีละไฟล์
mysql -h localhost -P 3306 -u bluepi_user -pblupi_dev bluepi_db < backend/app/Models/Schema/Products.sql
mysql -h localhost -P 3306 -u bluepi_user -pblupi_dev bluepi_db < backend/app/Models/Schema/Transactions.sql
mysql -h localhost -P 3306 -u bluepi_user -pblupi_dev bluepi_db < backend/app/Models/Schema/PaymentStatus.sql
mysql -h localhost -P 3306 -u bluepi_user -pblupi_dev bluepi_db < backend/app/Models/Schema/Cash.sql
```

## การใช้งาน

### CodeIgniter 4 Commands

```bash
# Migration
php spark migrate

# Seeding
php spark db:seed

# Create Controller
php spark make:controller ControllerName

# Create Model
php spark make:model ModelName

# Create Migration
php spark make:migration CreateTableName

# Clear cache
php spark cache:clear
```

### API Endpoints

CodeIgniter 4 API endpoints จะเข้าถึงได้ที่:
- Base URL: http://localhost:8080
- API Routes: http://localhost:8080/api/*

## การพัฒนา

### การเพิ่มฟีเจอร์ใหม่

1. สร้าง feature branch:
```bash
git checkout -b feature/feature-name
```

2. พัฒนาและทำการทดสอบ
3. Commit และ push changes
4. สร้าง Pull Request

### การทดสอบ

```bash
# Backend testing (CodeIgniter 4)
cd backend
# รัน PHPUnit tests
vendor/bin/phpunit
# หรือใช้ spark command
php spark test

# Frontend testing (Next.js)
cd client
npm test
```

## Environment Variables

สร้างไฟล์ `.env` และตั้งค่าตัวแปรต่อไปนี้:

```env

# CodeIgniter Environment
CI_ENVIRONMENT = development

```

## API Documentation

[[ลิงก์ไปยัง API documentation หรือ endpoint list]]

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **Port conflict**: ตรวจสอบว่า port 3000, 8080, 3306 ไม่ถูกใช้งานโดยแอปพลิเคชันอื่น
2. **Database connection**: ตรวจสอบการตั้งค่า database ใน `.env` ของ CodeIgniter
3. **Docker build failed**: ลองรัน `docker-compose down` และ `docker-compose up --build -d` ใหม่
4. **Schema not loaded**: 
   - ตรวจสอบว่าไฟล์ `docker/mysql/init.sql` มีอยู่และมีเนื้อหา
   - ลบ volume เดิม: `docker-compose down -v` แล้ว build ใหม่
5. **Frontend build error**: ตรวจสอบ dependencies ใน `client/package.json`
6. **Backend Apache not working**: ตรวจสอบไฟล์ `docker/apache/000-default.conf`
7. **Volume mounting issues**: ตรวจสอบ path ใน docker-compose.yml


## การสนับสนุน

หากพบปัญหาการใช้งาน สามารถ:
- สร้าง Issue ใน repository
- ติดต่อผู้พัฒนา: narathip.jin@gmail.com

## ผู้พัฒนา

- Naraphip Jinphala
