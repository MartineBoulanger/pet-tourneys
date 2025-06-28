import { Logo } from './Logo';
import { AdminNav, Menu } from '@/components/navigation';

export async function Header() {
  return (
    <header className='w-full p-5 sticky top-0 left-0 right-0 bg-background shadow-md z-50'>
      <nav className='flex justify-between items-center max-w-screen-2xl mx-auto'>
        <Logo />
        <div className='flex items-center justify-end flex-0'>
          <AdminNav />
          <Menu className='p-0 m-0 hidden lg:block' />
        </div>
      </nav>
    </header>
  );
}
