import { Select, Table, Tag, Typography } from "antd";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Appointment } from "../interface/comon";
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
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

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
      toast.success("Status updated!");
      fetchAppointments(); // refresh data
    } catch (err) {
      toast.error("Failed to update status");
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

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={4}>Manage Appointments (Admin)</Title>

      <Table
        dataSource={appointments}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default AdminAppointments;
