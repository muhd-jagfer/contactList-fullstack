import { api } from "./api";

const ContactList = ({ contacts, onSelect, onEdit, onRefresh }) => {
  const toggleFavorite = async (contact) => {
    await api(`/contacts/${contact.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isFavorite: !contact.isFavorite }),
    });
    onRefresh();
  };

  const remove = async (contact) => {
    if (!window.confirm(`Delete ${contact.firstName}?`)) return;

    await api(`/contacts/${contact.id}`, { method: "DELETE" });
    onRefresh();
  };

  if (!contacts.length) {
    return (
      <div className="empty">
        <strong>No contacts here yet.</strong>
        <span>Add Contact or try another search.</span>
      </div>
    );
  }

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <article
          className="contact-row"
          key={contact.id}
          onClick={() => onSelect(contact)}
        >
          <div className="contact-name">
            <strong>
              {contact.firstName} {contact.lastName}
            </strong>
            <span>{contact.email || contact.phone || "No details added"}</span>
          </div>

          <span className="group-tag">
            {contact.group?.name || "Unassigned"}
          </span>

          <button
            className={`favorite ${contact.isFavorite ? "active" : ""}`}
            onClick={(event) => {
              event.stopPropagation();
              toggleFavorite(contact);
            }}
            aria-label="Toggle favorite"
          >
            ★
          </button>

          <button
            className="row-action"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(contact);
            }}
          >
            Edit
          </button>

          <button
            className="row-action danger"
            onClick={(event) => {
              event.stopPropagation();
              remove(contact);
            }}
          >
            Delete
          </button>
        </article>
      ))}
    </div>
  );
};

export default ContactList;