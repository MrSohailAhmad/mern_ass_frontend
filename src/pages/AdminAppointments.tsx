import {
  Table,
  Tag,
  Select,
  Typography,
  message,
  Button,
  Form,
  Input,
  Modal,
} from "antd";

import { useEffect, useState } from "react";
import type { Appointment, Doctor, User } from "../interface/comon";
import axiosInstance from "../services/axiosInstance";

const { Title } = Typography;
const { Option } = Select;

const statusColor = {
  pending: "gold",
  confirmed: "green",
  cancelled: "red",
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axiosInstance.get("/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(res.data);
    } catch (err) {
      message.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };
  const fetchDoctorsAndUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [doctorsRes, usersRes] = await Promise.all([
        axiosInstance.get("/api/doctors", config),
        axiosInstance.get("/api/users", config), // you need this route in backend
      ]);

      setDoctors(doctorsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      message.error("Failed to load doctors/users");
    }
  };

  useEffect(() => {
    fetchDoctorsAndUsers();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axiosInstance.patch(
        `/api/appointments/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Status updated!");
      fetchAppointments(); // refresh data
    } catch (err) {
      message.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const columns = [
    {
      title: "Patient",
      dataIndex: ["userId", "name"],
    },
    {
      title: "Email",
      dataIndex: ["userId", "email"],
    },
    {
      title: "Doctor",
      dataIndex: ["doctorId", "name"],
    },
    {
      title: "Specialty",
      dataIndex: ["doctorId", "specialty"],
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={statusColor[status as keyof typeof statusColor]}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Change Status",
      render: (_: any, record: Appointment) => (
        <Select
          defaultValue={record.status}
          style={{ width: 120 }}
          onChange={(value) => updateStatus(record._id, value)}
        >
          <Option value="pending">Pending</Option>
          <Option value="confirmed">Confirmed</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      ),
    },
  ];

  const handleCreateAppointment = async (values: any) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axiosInstance.post(
        "/api/appointments",
        {
          doctorId: values.doctorId,
          userId: values.userId,
          date: values.date,
          time: values.time,
          status: "pending",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Appointment created");
      setModalOpen(false);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      message.error("Failed to create appointment");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>Manage Appointments (Admin)</Title>
      <Button
        type="primary"
        onClick={() => setModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Create Appointment
      </Button>
      <Table
        dataSource={appointments}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />
      {modalOpen && (
        <Modal
          open={modalOpen}
          title="Add New Appointment"
          onCancel={() => setModalOpen(false)}
          footer={null}
        >
          <Form layout="vertical" onFinish={handleCreateAppointment}>
            <Form.Item label="User" name="userId" rules={[{ required: true }]}>
              <Select placeholder="Select a user">
                {users?.map((u) => (
                  <Option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Doctor"
              name="doctorId"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select a doctor">
                {doctors?.map((d) => (
                  <Option key={d._id} value={d._id}>
                    {d.name} ({d.specialty})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Date" name="date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item label="Time" name="time" rules={[{ required: true }]}>
              <Input type="time" />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default AdminAppointments;
