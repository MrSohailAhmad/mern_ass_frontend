import { Button, Form, Input, Typography } from "antd";

import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { UserRole } from "../interface/comon";
import { toast } from "react-toastify";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    try {
      const res = await axiosInstance.post("/api/auth/login", values);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === UserRole.ADMIN) {
        navigate("/admin");
      } else if (res.data.user.role === UserRole.ADMIN) {
        navigate("/user");
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      let message = "an unknown error";
      if (err instanceof Error) {
        message = err.message;
      }
      toast.error(`Login failed due to ${message}`);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: "5rem" }}>
      <Title style={{ textAlign: "center" }} level={1}>
        Login
      </Title>
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
