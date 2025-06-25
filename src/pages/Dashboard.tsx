import { Layout, Menu, Button } from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../interface/comon";

const { Header, Sider, Content } = Layout;

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const role = user?.role;

  console.log(user);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible>
        <div
          style={{
            color: "white",
            textAlign: "center",
            padding: "1rem",
            fontWeight: "bold",
          }}
        >
          Dashboard
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/doctors">Doctor Directory</Link>
          </Menu.Item>
          {role === UserRole.USER && (
            <Menu.Item key="appointments" icon={<CalendarOutlined />}>
              <Link to="/my-appointments">My Appointments</Link>
            </Menu.Item>
          )}
          {role === UserRole.ADMIN && (
            <>
              <Menu.Item key="admin-appts" icon={<TeamOutlined />}>
                <Link to="/admin">Manage Appointments</Link>
              </Menu.Item>
              <Menu.Item key="admin-docs" icon={<UserOutlined />}>
                <Link to="/admin/doctors">Manage Doctors</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Sider>

      {/* Main Content Area */}
      <Layout>
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
            Welcome, <strong>{user?.name}</strong>
          </div>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Button>
        </Header>
        <Content
          style={{ margin: "1rem", padding: "1rem", background: "#fff" }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
