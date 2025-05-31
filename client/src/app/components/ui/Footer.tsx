'use client'

import Container from './Container'

export default function Footer() {
    return (
        <footer className="bg-[#f8f9fb] border-t border-gray-200 text-gray-700">
            <Container>
                <div className="mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">เกี่ยวกับเรา</h3>
                        <p className="text-gray-600 mb-1">Naraphip สร้างขึ้นมาเพื่อทำ challenge เท่านั้น</p>
                    </div>

                    {/* ข้อมูลติดต่อ */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3">ติดต่อเรา</h4>
                        <p className="text-gray-600 mb-1">อีเมล: narathip.jin@gmail.com</p>
                        <p className="text-gray-600">กรุงเทพมหานคร ประเทศไทย</p>
                    </div>
                </div>
            </Container>
            <div className="text-center text-xs text-gray-500 border-t py-4 px-6">
                © {new Date().getFullYear()} Naraphip All rights reserved.
            </div>
        </footer>
    )
}
