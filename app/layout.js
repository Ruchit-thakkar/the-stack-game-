import './globals.css';

export const metadata = {
  title: 'STACK - 3D Isometric Arcade Stacker',
  description: 'Stack isometric blocks as high as you can! Compete to beat your high score in this addicting, zero-dependency browser game.',
  keywords: 'stack game, 3d stack, isometric stack, arcade game, browser game, next.js game',
  authors: [{ name: 'Antigravity Code Assistant' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full select-none">
      <body className="antialiased bg-slate-950 text-white overflow-hidden h-full w-full">
        {children}
      </body>
    </html>
  );
}
