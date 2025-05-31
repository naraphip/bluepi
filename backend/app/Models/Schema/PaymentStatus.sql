CREATE TABLE IF NOT EXISTS payment_status (
    id INT AUTO_INCREMENT PRIMARY KEY,        -- รหัสสถานะการชำระเงิน
    name VARCHAR(100) NOT NULL,               -- ชื่อสถานะ เช่น paid, pending, failed
    description TEXT DEFAULT NULL,            -- คำอธิบายเพิ่มเติม
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- วันที่สร้าง
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- วันที่อัปเดตล่าสุด
);

INSERT INTO payment_status (id, name, description) VALUES
(0, 'Pending', 'รอดำเนินการ'),
(1, 'Confirmed', 'ชำระเงินสำเร็จ'),
(2, 'Cancelled', 'ยกเลิกรายการ');
