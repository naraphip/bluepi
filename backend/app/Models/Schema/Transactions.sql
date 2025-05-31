CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- รหัสรายการธุรกรรม
    booking_no VARCHAR(100) NOT NULL,               -- หมายเลขการจองหรืออ้างอิง
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,     -- ยอดเงินในการทำรายการ
    payment_status INT NOT NULL,                    -- รหัสสถานะการชำระเงิน (FK ไปยัง payment_status.id)
    allocated_data JSON DEFAULT NULL,               -- ข้อมูลการจองที่จัดสรร (เก็บเป็น JSON)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- วันที่สร้าง
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- วันที่อัปเดตล่าสุด
);
