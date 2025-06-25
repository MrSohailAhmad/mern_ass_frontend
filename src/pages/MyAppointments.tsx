import { List, Card, Tag, Typography } from "antd";

import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);

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
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>My Appointments</Title>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={appointments}
        renderItem={(appt) => (
          <List.Item>
            <Card title={appt.doctorId.name}>
              <p>
                <strong>Specialty:</strong> {appt.doctorId.specialty}
              </p>
              <p>
                <strong>Location:</strong> {appt.doctorId.location}
              </p>
              <p>
                <strong>Contact:</strong> {appt.doctorId.contact}
              </p>
              <p>
                <strong>Date:</strong> {appt.date}
              </p>
              <p>
                <strong>Time:</strong> {appt.time}
              </p>
              <Tag color={statusColor[appt.status]}>
                {appt.status.toUpperCase()}
              </Tag>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MyAppointments;
