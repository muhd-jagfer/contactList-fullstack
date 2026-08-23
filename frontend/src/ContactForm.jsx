import { useState } from "react";
import { api } from "./api";

const ContactForm = ({ existingContact = {}, groups, onSaved }) => {
  const [form, setForm] = useState({
    firstName: existingContact.firstName || "",
    lastName: existingContact.lastName || "",
    email: existingContact.email || "",
    phone: existingContact.phone || "",
    groupId: existingContact.group?.id || "",
    isFavorite: existingContact.isFavorite || false,
  });
  const [error, setError] = useState("");
  const update = (event) => {
    const { name, type, value, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async (event) => {
    event.preventDefault();

    try {
      await api(existingContact.id ? `/contacts/${existingContact.id}` : "/contacts", {
        method: existingContact.id ? "PATCH" : "POST",
        body: JSON.stringify({ ...form, groupId: form.groupId || null }),
      });
      onSaved();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <form onSubmit={submit} className="stack-form">
      <label>
        First name
        <input name="firstName" value={form.firstName} onChange={update} required />
      </label>
      <label>
        Last name
        <input name="lastName" value={form.lastName} onChange={update} />
      </label>
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={update} />
      </label>
      <label>
        Phone
        <input name="phone" value={form.phone} onChange={update} />
      </label>
      <label>
        Group
        <select name="groupId" value={form.groupId} onChange={update}>
          <option value="">No group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </label>
      <label className="check">
        <input name="isFavorite" type="checkbox" checked={form.isFavorite} onChange={update} />
        Favorite
      </label>
      {error && <p className="error">{error}</p>}
      <button className="primary" type="submit">
        {existingContact.id ? "Save changes" : "Create contact"}
      </button>
    </form>
  );
};

export default ContactForm;