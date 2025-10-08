import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, Modal, Select, message, Input } from "antd";
import axios from "axios";

const { Option } = Select;

const HQAdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [inspectionReport, setInspectionReport] = useState(null);
  const [filter, setFilter] = useState("all");
  const [employees, setEmployees] = useState([]);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [newManager, setNewManager] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
    } catch (err) {
      message.error("Failed to fetch projects");
    }
    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
    } catch (err) {
      message.error("Failed to fetch employees");
    }
  };

  const handleShowReport = async (projectId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/inspection-report/${projectId}`);
      setInspectionReport(res.data);
      setSelectedProject(projectId);
    } catch (err) {
      message.error("Failed to fetch inspection report");
    }
  };

  const handleResolveTicket = async (ticketId) => {
    try {
      await axios.post(`/api/tickets/resolve/${ticketId}`);
      message.success("Ticket resolved");
      fetchProjects();
    } catch (err) {
      message.error("Failed to resolve ticket");
    }
  };

  const handleAddManager = async () => {
    try {
      await axios.post("http://localhost:5000/api/managers", newManager);
      message.success("Manager added");
      setShowManagerModal(false);
      setNewManager({ name: "", email: "" });
    } catch (err) {
      message.error("Failed to add manager");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Manager",
      dataIndex: ["manager", "name"],
      key: "manager",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        if (status === "Delayed") color = "red";
        if (status === "Completed") color = "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Inspection Report",
      key: "inspectionReport",
      render: (_, record) => (
        <Button onClick={() => handleShowReport(record._id)} type="link">
          View
        </Button>
      ),
    },
    {
      title: "Alerts",
      key: "alerts",
      render: (_, record) =>
        record.alerts && record.alerts.length > 0 ? (
          record.alerts.map((alert) => (
            <Tag
              color={alert.type === "Delay" ? "red" : "orange"}
              key={alert._id}
            >
              {alert.message}
            </Tag>
          ))
        ) : (
          <span>No Alerts</span>
        ),
    },
    {
      title: "Tickets",
      key: "tickets",
      render: (_, record) =>
        record.tickets && record.tickets.length > 0 ? (
          record.tickets.map((ticket) => (
            <Button
              key={ticket._id}
              type="primary"
              danger={ticket.status === "Open"}
              onClick={() => handleResolveTicket(ticket._id)}
            >
              {ticket.status === "Open" ? "Resolve" : "Resolved"}
            </Button>
          ))
        ) : (
          <span>No Tickets</span>
        ),
    },
  ];

  const filteredEmployees = employees.filter((emp) => {
    if (filter === "all") return true;
    if (filter === "over") return emp.performance > 80;
    if (filter === "under") return emp.performance < 40;
    return true;
  });

  return (
    <div style={{ padding: 32 }}>
      <Card
        title="HQAdmin Dashboard"
        style={{ marginBottom: 32 }}
        extra={
          <Button type="primary" onClick={() => setShowManagerModal(true)}>
            Add Manager
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={projects}
          loading={loading}
          rowKey="_id"
        />
      </Card>
      <Card title="Employee Performance Filter" style={{ marginBottom: 32 }}>
        <Select
          value={filter}
          onChange={setFilter}
          style={{ width: 200, marginBottom: 16 }}
        >
          <Option value="all">All Employees</Option>
          <Option value="over">Overperforming</Option>
          <Option value="under">Underperforming</Option>
        </Select>
        <Table
          columns={[
            { title: "Name", dataIndex: "name", key: "name" },
            {
              title: "Performance",
              dataIndex: "performance",
              key: "performance",
            },
          ]}
          dataSource={filteredEmployees}
          rowKey="_id"
        />
      </Card>
      <Modal
        title="Inspection Report"
        visible={!!inspectionReport}
        onCancel={() => setInspectionReport(null)}
        footer={null}
      >
        <p>{inspectionReport ? inspectionReport.report : ""}</p>
      </Modal>
      <Modal
        title="Add New Manager"
        visible={showManagerModal}
        onCancel={() => setShowManagerModal(false)}
        onOk={handleAddManager}
      >
        <Input
          placeholder="Manager Name"
          value={newManager.name}
          onChange={(e) =>
            setNewManager({ ...newManager, name: e.target.value })
          }
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Manager Email"
          value={newManager.email}
          onChange={(e) =>
            setNewManager({ ...newManager, email: e.target.value })
          }
        />
      </Modal>
    </div>
  );
};

export default HQAdminDashboard;
