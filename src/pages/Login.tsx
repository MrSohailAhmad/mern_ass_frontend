import { Button, Form, Input, Typography } from "antd";

import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    try {
      const res = await axiosInstance.post("/api/auth/login", values);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert(`Login failed due to : ${error?.message}`);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "auto",
        paddingTop: "5rem",
      }}
    >
      <Title level={2}>Login</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
          <div style={{ marginTop: 8, textAlign: "center" }}>
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
