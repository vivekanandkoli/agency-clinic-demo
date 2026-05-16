import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin Dashboard — Sound Dental Clinic',
  description: 'Admin panel for Sound Dental Clinic',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          :root {
            --primary: #2C6E5A;
            --primary-light: #4A9B82;
            --secondary: #FF6B6B;
            --dark: #1A1A18;
            --mid: #666;
            --light: #999;
            --border: #E5E5E5;
            --off-white: #F8F8F7;
            --success: #22C55E;
            --warning: #F59E0B;
            --danger: #EF4444;
          }
          body {
            font-family: 'DM Sans', sans-serif;
            background: var(--off-white);
            color: var(--dark);
          }
          .admin-header {
            background: white;
            padding: 20px 40px;
            border-bottom: 2px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
          }
          .admin-logo { font-size: 24px; font-weight: 700; color: var(--primary); }
          .admin-layout { display: flex; min-height: calc(100vh - 80px); }
          .admin-sidebar {
            width: 260px;
            background: white;
            border-right: 1px solid var(--border);
            padding: 30px 0;
            flex-shrink: 0;
          }
          .sidebar-nav { list-style: none; }
          .sidebar-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 30px;
            font-weight: 500;
            color: var(--mid);
            text-decoration: none;
            transition: all 0.2s;
          }
          .sidebar-item:hover, .sidebar-item.active {
            background: #f0faf6;
            color: var(--primary);
            border-left: 3px solid var(--primary);
          }
          .sidebar-item .icon { font-size: 18px; }
          .admin-main { flex: 1; padding: 40px; overflow-x: auto; }
          .admin-back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--mid);
            text-decoration: none;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .admin-back-link:hover { color: var(--primary); }
        `}</style>
      </head>
      <body>
        <header className="admin-header">
          <div className="admin-logo">⚙️ Sound Dental Admin</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ color: 'var(--mid)', textDecoration: 'none', fontSize: 14 }}>
              ← Back to site
            </Link>
            <div
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600,
              }}
            >
              A
            </div>
          </div>
        </header>
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <nav>
              <ul className="sidebar-nav">
                <li>
                  <Link href="/admin" className="sidebar-item">
                    <span className="icon">📊</span> Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/bookings" className="sidebar-item">
                    <span className="icon">📅</span> Bookings
                  </Link>
                </li>
                <li>
                  <Link href="/admin/services" className="sidebar-item">
                    <span className="icon">🦷</span> Services
                  </Link>
                </li>
                <li>
                  <Link href="/admin/doctors" className="sidebar-item">
                    <span className="icon">👨‍⚕️</span> Doctors
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>
          <main className="admin-main">{children}</main>
        </div>
      </body>
    </html>
  )
}
