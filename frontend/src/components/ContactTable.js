import React from "react";
import { Table, Button, Popconfirm, notification } from "antd";
import { EditOutlined, DeleteOutlined, PhoneOutlined } from "@ant-design/icons";
import { updateRecord, deleteRecord, callABC } from "../api";  // Import callABC here

// Updated handleCall function to use the imported callABC API
const handleCall = async (phone) => {
  try {
    // Send the phone number to the backend to initiate the call
    await callABC(phone);  // Call API from api.js
    notification.success({ message: `Calling ${phone}...` });
  } catch (error) {
    notification.error({ message: "Failed to initiate call." });
  }
};

const ContactTable = ({ contacts, setContacts, setIsModalOpen, setEditingContact, fetchContacts }) => {

  const handleDelete = async (id) => {
    await deleteRecord(id);
    notification.success({ message: "Contact deleted successfully!" });
    fetchContacts();
  };

  const handleEdit = (record) => {
    setEditingContact(record);
    setIsModalOpen(true);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone Number", dataIndex: "phone_number", key: "phone_number" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => handleEdit(record)}
            type="link"
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this contact?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
          {/* Call Button */}
          {record.phone_number && (
            <Button
              onClick={() => handleCall(record.phone_number)}
              type="primary"
              icon={<PhoneOutlined />}
              style={{ marginLeft: 10 }}
            >
              Call
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={contacts}
      columns={columns}
      rowKey="id"
      style={{ marginTop: "20px" }}
    />
  );
};

export default ContactTable;
