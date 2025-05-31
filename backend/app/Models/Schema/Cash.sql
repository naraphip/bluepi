CREATE TABLE IF NOT EXISTS cash (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- รหัสรายการ
    denomination DECIMAL(10,2) NOT NULL,     -- มูลค่าเหรียญ/ธนบัตร เช่น 1.00, 5.00
    quantity INT NOT NULL DEFAULT 0,         -- จำนวนที่มี
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- วันที่สร้าง
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- วันที่อัปเดตล่าสุด
);

INSERT INTO cash (denomination, quantity, created_at, updated_at) VALUES
(1, 100, NOW(), NOW()),       -- เหรียญ 1 บาท
(5, 80, NOW(), NOW()),        -- เหรียญ 5 บาท
(10, 70, NOW(), NOW()),       -- เหรียญ 10 บาท
(20, 50, NOW(), NOW()),       -- ธนบัตร 20 บาท
(50, 40, NOW(), NOW()),       -- ธนบัตร 50 บาท
(100, 30, NOW(), NOW()),      -- ธนบัตร 100 บาท
(500, 20, NOW(), NOW()),      -- ธนบัตร 500 บาท
(1000, 10, NOW(), NOW());     -- ธนบัตร 1000 บาท
