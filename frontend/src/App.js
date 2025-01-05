// src/App.js
import React, { useState, useEffect } from "react";
import { Button, notification } from "antd";
import ContactTable from "./components/ContactTable";
import ContactForm from "./components/ContactForm";
import { fetchRecords } from "./api";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetchRecords();
    setContacts(response.data);
  };

  const handleAdd = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Connectify | Connect with you Friend</h1>
      <Button type="primary" onClick={handleAdd}>
        Add Contact
      </Button>

      <ContactTable
        contacts={contacts}
        setContacts={setContacts}
        setIsModalOpen={setIsModalOpen}
        setEditingContact={setEditingContact}
        fetchContacts={fetchContacts}
      />

      <ContactForm
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingContact={editingContact}
        setContacts={setContacts}
        fetchContacts={fetchContacts}
      />
    </div>
  );
};

export default App;
