CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- รหัสสินค้า
    name VARCHAR(255) NOT NULL,                     -- ชื่อสินค้า
    sku VARCHAR(100) NOT NULL UNIQUE,               -- รหัสสินค้า (ไม่ซ้ำ)
    image_url TEXT DEFAULT NULL,                    -- URL รูปภาพสินค้า
    description TEXT DEFAULT NULL,                  -- รายละเอียดสินค้า
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,      -- ราคาสินค้า
    stock INT NOT NULL DEFAULT 0,                   -- จำนวนในสต๊อก
    status TINYINT(1) NOT NULL DEFAULT 1,           -- สถานะการใช้งาน (1 = เปิดใช้งาน, 0 = ปิด)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- วันที่สร้าง
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- วันที่อัปเดตล่าสุด
);

INSERT INTO products (name, sku, image_url, description, price, stock, status, created_at, updated_at) VALUES
('น้ำดื่มธรรมชาติ', 'SKU001', '/images/products/water.jpg', 'น้ำแร่ธรรมชาติบริสุทธิ์ 600ml', 10.00, 100, 1, NOW(), NOW()),
('มันฝรั่งทอด', 'SKU002', '/images/products/testo.jpg', 'มันฝรั่งกรอบ ขนาด 40g', 25.00, 80, 1, NOW(), NOW()),
('ชาเขียวขวด', 'SKU003', '/images/products/greentea.jpg', 'ชาเขียวญี่ปุ่น ขนาด 500ml', 20.00, 60, 1, NOW(), NOW()),
('ช็อกโกแลตแท่ง', 'SKU004', '/images/products/chocolate.jpg', 'ช็อกโกแลตคุณภาพดี ขนาด 35g', 15.00, 50, 1, NOW(), NOW()),
('กาแฟกระป๋อง', 'SKU005', '/images/products/coffee.jpg', 'กาแฟดำเข้มข้น ขนาด 240ml', 18.00, 40, 1, NOW(), NOW());
