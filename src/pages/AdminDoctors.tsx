import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Pagination,
} from "antd";

import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";

const { Option } = Select;

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  availability: string[];
  location: string;
  contact: string;
}

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [search, setSearch] = useState<string>("");
  const fetchDoctors = async (searchTerm = "", pageNum = 1) => {
    try {
      const token = localStorage.getItem("accessToken");
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/doctors/all?search=${searchTerm}&page=${pageNum}&limit=${limit}`,
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
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (values: any) => {
    const token = localStorage.getItem("accessToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editingDoctor) {
        await axiosInstance.put(
          `/api/doctors/${editingDoctor._id}`,
          values,
          config
        );
        toast.success("Doctor updated");
      } else {
        await axiosInstance.post("/api/doctors", values, config);
        toast.success("Doctor added");
      }
      fetchDoctors();
      setModalOpen(false);
      form.resetFields();
      setEditingDoctor(null);
    } catch (err) {
      toast.error("Failed to save doctor");
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axiosInstance.delete(`/api/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Doctor deleted");
      fetchDoctors();
    } catch (err) {
      message.error("Failed to delete doctor");
    }
  };

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    form.setFieldsValue(doctor);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchDoctors(search, page);
  }, [search, page]);

  return (
    <div style={{ width: "100%", padding: "2rem" }}>
      <h2>Doctor Management (Admin)</h2>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "between",
        }}
      >
        <Button
          type="primary"
          onClick={() => setModalOpen(true)}
          style={{ marginBottom: 16 }}
        >
          Add Doctor
        </Button>
        <Input.Search
          placeholder="Search doctors..."
          allowClear
          enterButton="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => {
            setPage(1); // Reset to page 1 on new search
            fetchDoctors(value, 1);
          }}
          style={{ width: 300, marginBottom: 16, marginLeft: "auto" }}
        />
      </div>
      <Table
        dataSource={doctors}
        pagination={false}
        rowKey="_id"
        loading={loading}
      >
        <Table.Column title="Name" dataIndex="name" />
        <Table.Column title="Specialty" dataIndex="specialty" />
        <Table.Column title="Location" dataIndex="location" />
        <Table.Column title="Contact" dataIndex="contact" />
        <Table.Column
          title="Availability"
          dataIndex="availability"
          render={(a: string[]) => a.join(", ")}
        />
        <Table.Column
          title="Actions"
          render={(_: any, doctor: Doctor) => (
            <Space>
              <Button onClick={() => openEditModal(doctor)}>Edit</Button>
              <Button danger onClick={() => handleDelete(doctor._id)}>
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>
      <Pagination
        current={page}
        total={totalDoctors}
        pageSize={limit}
        onChange={(newPage) => {
          setPage(newPage);
          fetchDoctors("", newPage);
        }}
        style={{ textAlign: "center", marginTop: 20 }}
      />

      <Modal
        open={modalOpen}
        title={editingDoctor ? "Edit Doctor" : "Add Doctor"}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingDoctor(null);
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="specialty"
            label="Specialty"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="availability"
            label="Availability (comma separated)"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="e.g. Monday 9AM-12PM, Wednesday 3PM-5PM"
              onBlur={(e) =>
                form.setFieldsValue({
                  availability: e.target.value.split(",").map((a) => a.trim()),
                })
              }
            />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contact"
            label="Contact"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDoctors;
