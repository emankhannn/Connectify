import React, { useState, useEffect } from "react";
import { Modal, Input, Form, notification } from "antd";
import { createRecord, updateRecord } from "../api";

const ContactForm = ({ isModalOpen, setIsModalOpen, editingContact, setContacts, fetchContacts }) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (editingContact) {
      form.setFieldsValue(editingContact);
    } else {
      form.resetFields();
    }
  }, [editingContact, form]);

  const handleSave = async () => {
    try {
      // Validate the form
      const values = await form.validateFields();
      
      if (editingContact) {
        await updateRecord(editingContact.id, values);
        notification.success({ message: "Contact updated successfully!" });
      } else {
        await createRecord(values);
        notification.success({ message: "Contact added successfully!" });
      }

      setIsModalOpen(false);
      fetchContacts();
    } catch (error) {
      // Handle form validation errors
      console.log("Form validation failed:", error);
    }
  };

  return (
    <Modal
      title={editingContact ? "Edit Contact" : "Add Contact"}
      visible={isModalOpen}
      onOk={handleSave}
      onCancel={() => setIsModalOpen(false)}
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout="vertical"
        name="contactForm"
        initialValues={{ name: "", phone: "" }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Phone"
          rules={[{ required: true, message: "Please input the phone number!" }]}
        >
          <Input placeholder="Phone" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContactForm;
