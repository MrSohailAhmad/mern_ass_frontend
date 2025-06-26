import { Button, Form, Input, Typography } from "antd";

import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      await axiosInstance.post("/api/auth/register", values);
      alert("Registration successful! You can now log in.");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: "5rem" }}>
      <Title style={{ textAlign: "center" }} level={1}>
        Register
      </Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
          <div style={{ marginTop: 8, textAlign: "center" }}>
            Already have an account? <Link to="/">Login</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
