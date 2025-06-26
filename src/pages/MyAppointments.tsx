import {
  List,
  Card,
  Tag,
  Typography,
  Modal,
  Button,
  Form,
  Select,
  Input,
} from "antd";

import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";

import type { Doctor, User } from "../interface/comon";
import { Option } from "antd/es/mentions";
import { useAuth } from "../context/AuthContext";

const { Title } = Typography;

interface Appointment {
  _id: string;
  doctorId: {
    name: string;
    specialty: string;
    location: string;
    contact: string;
  };
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
}

const statusColor = {
  pending: "gold",
  confirmed: "green",
  cancelled: "red",
};

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form] = Form.useForm();
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axiosInstance.get("/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(res.data);
    } catch (err) {
      toast.error(`Error fetching appointments: ${err}`);
    }
  };

  const fetchDoctorsAndUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [doctorsRes, usersRes] = await Promise.all([
        axiosInstance.get("/api/doctors", config),
        axiosInstance.get("/api/users", config),
      ]);

      setDoctors(doctorsRes.data.doctors);
      setUsers(usersRes.data);

      if (user) {
        form.setFieldsValue({ userId: user?.id });
      }
    } catch (error) {
      toast.error("Failed to load doctors/users");
    }
  };

  useEffect(() => {
    fetchDoctorsAndUsers();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

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
      toast.success("Appointment created");
      setModalOpen(false);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create appointment");
    }
  };

  return (
    <div>
      <Title level={2}>My Appointments</Title>
      <Button
        type="primary"
        onClick={() => setModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Create Appointment
      </Button>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={appointments}
        renderItem={(appt) => (
          <List.Item>
            <Card title={appt.doctorId?.name}>
              <p>
                <strong>Specialty:</strong> {appt.doctorId?.specialty}
              </p>
              <p>
                <strong>Location:</strong> {appt.doctorId?.location}
              </p>
              <p>
                <strong>Contact:</strong> {appt.doctorId?.contact}
              </p>
              <p>
                <strong>Date:</strong> {appt?.date}
              </p>
              <p>
                <strong>Time:</strong> {appt?.time}
              </p>
              <Tag color={statusColor[appt?.status]}>
                {appt?.status.toUpperCase()}
              </Tag>
            </Card>
          </List.Item>
        )}
      />
      {modalOpen && (
        <Modal
          open={modalOpen}
          title="Add New Appointment"
          onCancel={() => setModalOpen(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateAppointment}
          >
            <Form.Item label="User" name="userId" rules={[{ required: true }]}>
              <Select disabled={true} placeholder="Select a user">
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

export default MyAppointments;
