import { useEffect, useState } from "react";
import ContactForm from "./ContactForm";
import ContactList from "./ContactList";
import { api } from "./api";
import "./App.css";

function AuthScreen({ onAuthenticated }) {
  const [registering, setRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await api(registering ? "/register" : "/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      onAuthenticated(data.user);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">CONTACT BOOK</p>

        <h1>
          {registering ? "Create your account" : "Welcome back"}
        </h1>

        <p className="muted">Login or Register to continue.</p>

        <form onSubmit={submit} className="stack-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength="6"
              required
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button className="primary" type="submit">
            {registering ? "Register" : "Log in"}
          </button>
        </form>

        <button
          className="link-button"
          onClick={() => {
            setRegistering(!registering);
            setError("");
          }}
        >
          {registering
            ? "Already have an account? Log in to an existing account"
            : "Need an account? Register new account"}
        </button>
      </section>
    </main>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [details, setDetails] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [contactData, groupData] = await Promise.all([
        api(
          `/contacts?filter=${filter}&search=${encodeURIComponent(search)}`
        ),
        api("/groups"),
      ]);

      setContacts(contactData.contacts);
      setGroups(groupData.groups);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    api("/me")
      .then((data) => setUser(data.user))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;

    const refresh = async () => {
      try {
        const [contactData, groupData] = await Promise.all([
          api(
            `/contacts?filter=${filter}&search=${encodeURIComponent(search)}`
          ),
          api("/groups"),
        ]);

        setContacts(contactData.contacts);
        setGroups(groupData.groups);
        setError("");
      } catch (requestError) {
        setError(requestError.message);
      }
    };

    refresh();
  }, [user, filter, search]);

  const logout = async () => {
    await api("/logout", { method: "POST" });
    setUser(null);
  };

  const addGroup = async (event) => {
    event.preventDefault();

    if (!groupName.trim()) return;

    try {
      await api("/groups", {
        method: "POST",
        body: JSON.stringify({ name: groupName }),
      });

      setGroupName("");
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const editGroup = async (group) => {
    const name = window.prompt("Rename group", group.name)?.trim();
    if (!name || name === group.name) return;

    try {
      await api(`/groups/${group.id}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const deleteGroup = async (group) => {
    if (!window.confirm(`Delete the ${group.name} group?`)) return;

    try {
      await api(`/groups/${group.id}`, { method: "DELETE" });
      if (filter === String(group.id)) setFilter("all");
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (!user) {
    return <AuthScreen onAuthenticated={setUser} />;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">CONTACT BOOK</p>
          <h1>Your people</h1>
        </div>

        <div className="account">
          <span>{user.email}</span>
          <button onClick={logout}>Log out</button>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <p className="section-label">FILTERS</p>

          <button
            className={filter === "all" ? "selected" : ""}
            onClick={() => setFilter("all")}
          >
            All contacts
          </button>

          <button
            className={filter === "favorites" ? "selected" : ""}
            onClick={() => setFilter("favorites")}
          >
            Favorites
          </button>

          <p className="section-label groups-label">GROUPS</p>

          {groups.map((group) => (
            <div className="group-item" key={group.id}>
              <button
                className={filter === String(group.id) ? "selected" : ""}
                onClick={() => setFilter(String(group.id))}
              >
                {group.name}
              </button>
              {!['Home', 'Friends', 'Work'].includes(group.name) && (
                <span className="group-actions">
                  <button onClick={() => editGroup(group)} aria-label={`Rename ${group.name}`}>Edit</button>
                  <button onClick={() => deleteGroup(group)} aria-label={`Delete ${group.name}`}>Delete</button>
                </span>
              )}
            </div>
          ))}

          <form onSubmit={addGroup} className="new-group">
            <input
              placeholder="New group"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
            />

            <button aria-label="Add group">+</button>
          </form>
        </aside>

        <section className="content">
          <div className="content-header">
            <div>
              <p className="eyebrow">
                {filter === "favorites"
                  ? "FAVORITES"
                  : filter === "all"
                    ? "ALL CONTACTS"
                    : groups
                        .find(
                          (group) =>
                            String(group.id) === filter
                        )
                        ?.name.toUpperCase()}
              </p>

              <h2>
                {contacts.length}{" "}
                {contacts.length === 1 ? "contact" : "contacts"}
              </h2>
            </div>

            <button
              className="primary"
              onClick={() => setEditing({})}
            >
              + Add contact
            </button>
          </div>

          <input
            className="search"
            placeholder="Search by name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <ContactList
            contacts={contacts}
            onSelect={setDetails}
            onEdit={setEditing}
            onRefresh={load}
          />
        </section>
      </div>

      {editing && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close"
              onClick={() => setEditing(null)}
              aria-label="Close"
            >
              ×
            </button>

            <h2>
              {editing.id ? "Edit contact" : "New contact"}
            </h2>

            <ContactForm
              existingContact={editing}
              groups={groups}
              onSaved={() => {
                setEditing(null);
                load();
              }}
            />
          </div>
        </div>
      )}

      {details && (
        <div className="modal">
          <div className="modal-content detail">
            <button
              className="close"
              onClick={() => setDetails(null)}
              aria-label="Close"
            >
              ×
            </button>

            <p className="eyebrow">CONTACT DETAILS</p>

            <h2>
              {details.firstName} {details.lastName}
            </h2>

            <dl>
              <dt>Email</dt>
              <dd>{details.email || "Not provided"}</dd>

              <dt>Phone</dt>
              <dd>{details.phone || "Not provided"}</dd>

              <dt>Group</dt>
              <dd>{details.group?.name || "No group"}</dd>

              <dt>Status</dt>
              <dd>
                {details.isFavorite
                  ? "Favorite"
                  : "Regular contact"}
              </dd>
            </dl>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;