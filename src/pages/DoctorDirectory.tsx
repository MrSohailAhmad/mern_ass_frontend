import {
  Card,
  Input,
  List,
  Typography,
  Button,
  Pagination,
  message,
} from "antd";

import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

const { Title } = Typography;
const { Search } = Input;

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  availability: string[];
  location: string;
  contact: string;
}

const DoctorDirectory = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);

  const fetchDoctors = async (searchTerm = "", pageNum = 1) => {
    try {
      const token = localStorage.getItem("accessToken");
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/doctors/all?search=${searchTerm}&page=${pageNum}&limit=4`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDoctors(res.data.doctors);
      setTotalPages(res.data.totalPages);
      setTotalDoctors(res.data.total);
    } catch (error) {
      message.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(search, page);
  }, [search, page]);

  console.log("doctors", doctors);

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>Doctor Directory</Title>

      <Search
        placeholder="Search by name, specialty or location"
        allowClear
        enterButton="Search"
        size="middle"
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        style={{ maxWidth: 400, marginBottom: 24 }}
      />

      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={doctors}
        loading={loading}
        renderItem={(doc) => (
          <List.Item>
            <Card title={doc.name}>
              <p>
                <strong>Specialty:</strong> {doc.specialty}
              </p>
              <p>
                <strong>Location:</strong> {doc.location}
              </p>
              <p>
                <strong>Contact:</strong> {doc.contact}
              </p>
              <p>
                <strong>Availability:</strong> {doc.availability.join(", ")}
              </p>
              {/* <Button
                onClick={() => alert(`Book appointment with ${doc.name}`)}
              >
                Book Appointment
              </Button> */}
            </Card>
          </List.Item>
        )}
      />

      <Pagination
        current={page}
        pageSize={4}
        total={totalDoctors}
        onChange={(page) => setPage(page)}
        style={{ textAlign: "center", marginTop: 20 }}
      />
    </div>
  );
};

export default DoctorDirectory;
