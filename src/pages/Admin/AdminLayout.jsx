import { Outlet } from 'react-router-dom';
import AdminNavbar from '../../components/Admin/AdminNavbar';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-content">
        <Outlet /> {/* Esto renderizará las subrutas (MovieManager, ProfileManager) */}
      </div>
    </div>
  );
}