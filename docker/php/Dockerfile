FROM php:8.1-apache

# ติดตั้ง extension และ dependencies ที่จำเป็น
RUN apt-get update && apt-get install -y \
    libicu-dev \
    && docker-php-ext-install intl mysqli \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# เปิด mod_rewrite (สำหรับ Laravel หรือ CodeIgniter)
# RUN a2enmod rewrite
# RUN a2enmod headers
RUN a2enmod rewrite headers


# คัดลอกไฟล์โปรเจกต์ไปยัง DocumentRoot (จะถูก override ด้วย volume ถ้าใช้ docker-compose)
COPY . /var/www/html
# COPY ../apache/000-default.conf /etc/apache2/sites-available/000-default.conf


WORKDIR /var/www/html
