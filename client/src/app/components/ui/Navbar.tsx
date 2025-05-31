'use client';


import Link from 'next/link';

// import Image from 'next/image';
import Container from './Container'; // หรือ '../Container' ตาม path ของคุณ




export default function Navbar() {




  // ฟังก์ชันสร้าง URL สำหรับ locale ปัจจุบัน
  const createLocaleUrl = (path: string) => {
    return `${path}`;
  };

  // ถ้าเป็น server-side render ให้ return null เพื่อป้องกัน hydration error


  return (
    <nav className="bg-white shadow-md border-b px-0 border-gray-200">
      <Container>
        <div className="flex items-center justify-between h-16 px-4 md:px-4 md:py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={createLocaleUrl('/')}>
              <div className="flex items-center">
                {/* <Image
                  src="/assets/logo/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-8 w-auto"
                /> */}
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-md">Naraphip</span>
              </div>
            </Link>
          </div>



          {/* Right Section */}
      
        </div>
      </Container>
    </nav>
  );
}