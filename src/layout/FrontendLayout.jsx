import { NavLink, Outlet } from "react-router-dom";

const FrontendLayout = () => {
  return (
    <div>
      <header className="border-bottom">
        <div className="container py-4">
          <h1 className="h3 mb-3">前台展示</h1>
          <nav className="nav nav-pills">
            <NavLink className="nav-link" to="/">
              首頁
            </NavLink>
            <NavLink className="nav-link" to="/product">
              產品頁面
            </NavLink>
            <NavLink className="nav-link" to="/cart">
              購物車頁面
            </NavLink>
            <NavLink className="nav-link" to="/admin">
              管理後台
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="container py-4">
        <Outlet />
      </main>
      <footer className="border-top py-4 text-center text-muted">
        © 2026 我的網站
      </footer>
    </div>
  );
};

export default FrontendLayout;
