import { Layout, Menu, Button } from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../interface/comon";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/");
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  const menuItems = isAdmin
    ? [
        {
          key: "/admin",
          icon: <CalendarOutlined />,
          label: <Link to="/admin">Manage Appointments</Link>,
        },
        {
          key: "/admin/doctors",
          icon: <UserOutlined />,
          label: <Link to="/admin/doctors">Manage Doctors</Link>,
        },
        {
          key: "/admin/doctors-directory",
          icon: <TeamOutlined />,
          label: <Link to="/admin/doctors-directory">Doctor Directory</Link>,
        },
      ]
    : [
        {
          key: "/user",
          icon: <CalendarOutlined />,
          label: <Link to="/user">My Appointments</Link>,
        },
        {
          key: "/user/doctors",
          icon: <TeamOutlined />,
          label: <Link to="/user/doctors">Doctor Directory</Link>,
        },
      ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible>
        <div
          style={{
            color: "white",
            textAlign: "center",
            fontSize: "1.2rem",
            padding: "1rem",
            fontWeight: "bold",
          }}
        >
          🩺 Dashboard
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Top Navbar */}
        <Header
          style={{
            background: "#fff",
            padding: "0 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            👋 Welcome, <strong>{user?.name}</strong>
          </div>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Button>
        </Header>

        {/* Main Content */}
        <Content
          style={{ margin: "1rem", padding: "1rem", background: "#fff" }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
