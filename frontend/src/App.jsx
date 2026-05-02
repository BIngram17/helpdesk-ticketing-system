import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import TicketModal from "./components/TicketModal";
import ArticleModal from "./components/ArticleModal";
import TicketCard from "./components/TicketCard";
import KnowledgeArticleCard from "./components/KnowledgeArticleCard";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [email, setEmail] = useState("brian@example.com");
  const [password, setPassword] = useState("Password123");
  const [message, setMessage] = useState("");

  const [token, setToken] = useState(() => {
    return localStorage.getItem("helpdeskToken") || "";
  });

  const [tickets, setTickets] = useState([]);

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("helpdeskUserEmail") || "";
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("helpdeskUserRole") || "";
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [assignedFilter, setAssignedFilter] = useState("All");

  const [activeView, setActiveView] = useState("dashboard");

  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [knowledgeArticles, setKnowledgeArticles] = useState([]);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const [knowledgeSearchTerm, setKnowledgeSearchTerm] = useState("");
  const [knowledgeCategoryFilter, setKnowledgeCategoryFilter] = useState("All");

  const [newArticle, setNewArticle] = useState({
    title: "",
    category: "Software",
    content: ""
  });

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [editArticle, setEditArticle] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "technician"
  });

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editTicket, setEditTicket] = useState(null);

  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Software",
    requester: "",
    assignedTo: ""
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("helpdeskToken");

    if (savedToken) {
      loadTickets(savedToken);
    }
  }, []);

  useEffect(() => {
    if (
      token &&
      userRole === "admin" &&
      ["dashboard", "tickets", "users"].includes(activeView) &&
      users.length === 0
    ) {
      loadUsers();
    }

    if (token && activeView === "knowledgeBase") {
      loadKnowledgeArticles();
    }

    if (token && userRole === "admin" && activeView === "auditLogs") {
      loadAuditLogs();
    }
  }, [activeView, token, userRole]);

  function getAuthHeaders(currentToken = token) {
    return {
      Authorization: `Bearer ${currentToken}`
    };
  }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const jwt = response.data.token;

      const meResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: getAuthHeaders(jwt)
      });

      localStorage.setItem("helpdeskToken", jwt);
      localStorage.setItem("helpdeskUserEmail", meResponse.data.email);
      localStorage.setItem("helpdeskUserRole", meResponse.data.role);

      setToken(jwt);
      setUserEmail(meResponse.data.email);
      setUserRole(meResponse.data.role);
      setMessage("Login successful");
      setActiveView("dashboard");

      loadTickets(jwt);

      if (meResponse.data.role === "admin") {
        loadUsers(jwt);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  }

  async function loadTickets(currentToken = token) {
    try {
      const response = await axios.get(`${API_URL}/tickets`, {
        headers: getAuthHeaders(currentToken)
      });

      setTickets(response.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
        setMessage("Session expired. Please log in again.");
        return;
      }

      setMessage(error.response?.data?.message || "Failed to load tickets");
    }
  }

  async function loadUsers(currentToken = token) {
    try {
      setUsersLoading(true);

      const response = await axios.get(`${API_URL}/users`, {
        headers: getAuthHeaders(currentToken)
      });

      setUsers(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  }

  async function createUser(e) {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/users`, newUser, {
        headers: getAuthHeaders()
      });

      setMessage("User created successfully");

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "technician"
      });

      loadUsers();

      if (activeView === "auditLogs") {
        loadAuditLogs();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create user");
    }
  }

  async function updateUserRole(userId, role) {
    try {
      await axios.put(
        `${API_URL}/users/${userId}/role`,
        { role },
        { headers: getAuthHeaders() }
      );

      setMessage(`User role updated to ${role}`);
      loadUsers();

      if (activeView === "auditLogs") {
        loadAuditLogs();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update user role");
    }
  }

  async function loadKnowledgeArticles(currentToken = token) {
    try {
      setKnowledgeLoading(true);

      const response = await axios.get(`${API_URL}/knowledge-base`, {
        headers: getAuthHeaders(currentToken)
      });

      setKnowledgeArticles(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load knowledge base"
      );
    } finally {
      setKnowledgeLoading(false);
    }
  }

  async function createKnowledgeArticle(e) {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/knowledge-base`, newArticle, {
        headers: getAuthHeaders()
      });

      setMessage("Knowledge base article created successfully");

      setNewArticle({
        title: "",
        category: "Software",
        content: ""
      });

      loadKnowledgeArticles();

      if (activeView === "auditLogs") {
        loadAuditLogs();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create article");
    }
  }

  async function saveKnowledgeArticle(e) {
    e.preventDefault();

    if (!editArticle) return;

    try {
      await axios.put(
        `${API_URL}/knowledge-base/${editArticle.id}`,
        {
          title: editArticle.title,
          category: editArticle.category,
          content: editArticle.content
        },
        { headers: getAuthHeaders() }
      );

      setMessage("Knowledge base article updated successfully");
      closeArticleModal();
      loadKnowledgeArticles();

      if (activeView === "auditLogs") {
        loadAuditLogs();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update article");
    }
  }

  async function deleteKnowledgeArticle(articleId) {
    try {
      await axios.delete(`${API_URL}/knowledge-base/${articleId}`, {
        headers: getAuthHeaders()
      });

      setMessage("Knowledge base article deleted");
      closeArticleModal();
      loadKnowledgeArticles();

      if (activeView === "auditLogs") {
        loadAuditLogs();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete article");
    }
  }

  function openArticleModal(article) {
    setSelectedArticle(article);
    setEditArticle({
      id: article.id,
      title: article.title || "",
      category: article.category || "Software",
      content: article.content || ""
    });
  }

  function closeArticleModal() {
    setSelectedArticle(null);
    setEditArticle(null);
  }

  async function loadAuditLogs() {
    if (userRole !== "admin") {
      setMessage("Admin access required");
      return;
    }

    try {
      setAuditLoading(true);

      const response = await axios.get(`${API_URL}/audit-logs`, {
        headers: getAuthHeaders()
      });

      setAuditLogs(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load audit logs");
    } finally {
      setAuditLoading(false);
    }
  }

  async function updateTicketStatus(ticketId, status) {
    try {
      await axios.put(
        `${API_URL}/tickets/${ticketId}`,
        { status },
        { headers: getAuthHeaders() }
      );

      setMessage(`Ticket ${ticketId} updated to ${status}`);
      loadTickets();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update ticket");
    }
  }

  async function createTicket(e) {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/tickets`, newTicket, {
        headers: getAuthHeaders()
      });

      setMessage("Ticket created successfully");

      setNewTicket({
        title: "",
        description: "",
        priority: "Medium",
        category: "Software",
        requester: "",
        assignedTo: ""
      });

      loadTickets();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create ticket");
    }
  }

  async function deleteTicket(ticketId) {
    try {
      await axios.delete(`${API_URL}/tickets/${ticketId}`, {
        headers: getAuthHeaders()
      });

      setMessage(`Ticket ${ticketId} deleted`);
      closeModal();
      loadTickets();

      if (activeView === "auditLogs" && userRole === "admin") {
        loadAuditLogs();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete ticket");
    }
  }

  async function saveTicketChanges(e) {
    e.preventDefault();

    if (!editTicket) return;

    try {
      await axios.put(
        `${API_URL}/tickets/${editTicket.id}`,
        {
          title: editTicket.title,
          description: editTicket.description,
          priority: editTicket.priority,
          status: editTicket.status,
          category: editTicket.category,
          requester: editTicket.requester,
          assignedTo: editTicket.assignedTo
        },
        { headers: getAuthHeaders() }
      );

      setMessage(`Ticket ${editTicket.id} updated successfully`);
      closeModal();
      loadTickets();

      if (activeView === "auditLogs" && userRole === "admin") {
        loadAuditLogs();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to save ticket changes"
      );
    }
  }

  function openTicketModal(ticket) {
    setSelectedTicket(ticket);
    setEditTicket({
      id: ticket.id,
      title: ticket.title || "",
      description: ticket.description || "",
      priority: ticket.priority || "Medium",
      status: ticket.status || "Open",
      category: ticket.category || "Software",
      requester: ticket.requester || "",
      assignedTo: ticket.assignedTo || ""
    });
  }

  function closeModal() {
    setSelectedTicket(null);
    setEditTicket(null);
  }

  function clearTicketFilters() {
    setSearchTerm("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setCategoryFilter("All");
    setAssignedFilter("All");
  }

  function logout() {
    localStorage.removeItem("helpdeskToken");
    localStorage.removeItem("helpdeskUserEmail");
    localStorage.removeItem("helpdeskUserRole");

    setToken("");
    setTickets([]);
    setUserEmail("");
    setUserRole("");
    setMessage("");
    setSearchTerm("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setCategoryFilter("All");
    setAssignedFilter("All");
    setActiveView("dashboard");
    setAuditLogs([]);
    setUsers([]);
    setKnowledgeArticles([]);
    closeModal();
    closeArticleModal();
  }

  const technicianOptions = users.filter((user) => user.role === "technician");

  const assignedOptions = Array.from(
    new Set(
      tickets
        .map((ticket) => ticket.assignedTo)
        .filter((assignedTo) => assignedTo && assignedTo.trim() !== "")
    )
  );

  const openTickets = tickets.filter((ticket) => ticket.status === "Open")
    .length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const filteredTickets = tickets.filter((ticket) => {
    const searchText =
      `${ticket.title} ${ticket.description} ${ticket.status} ${ticket.priority} ${ticket.category} ${ticket.requester} ${ticket.assignedTo}`.toLowerCase();

    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All" || ticket.priority === priorityFilter;
    const matchesCategory =
      categoryFilter === "All" || ticket.category === categoryFilter;
    const matchesAssigned =
      assignedFilter === "All" || ticket.assignedTo === assignedFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory &&
      matchesAssigned
    );
  });

  const knowledgeCategories = Array.from(
    new Set(knowledgeArticles.map((article) => article.category))
  );

  const filteredKnowledgeArticles = knowledgeArticles.filter((article) => {
    const searchText =
      `${article.title} ${article.category} ${article.content} ${article.authorEmail}`.toLowerCase();

    const matchesSearch = searchText.includes(
      knowledgeSearchTerm.toLowerCase()
    );

    const matchesCategory =
      knowledgeCategoryFilter === "All" ||
      article.category === knowledgeCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const adminUsers = users.filter((user) => user.role === "admin").length;
  const technicianUsers = users.filter(
    (user) => user.role === "technician"
  ).length;

  function renderAssignedToField(ticketState, setTicketState) {
    if (userRole === "admin" && technicianOptions.length > 0) {
      return (
        <select
          value={ticketState.assignedTo}
          onChange={(e) =>
            setTicketState({ ...ticketState, assignedTo: e.target.value })
          }
        >
          <option value="">Assign to technician</option>
          {technicianOptions.map((technician) => (
            <option key={technician.id} value={technician.email}>
              {technician.name} ({technician.email})
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        placeholder="Assigned To Email"
        value={ticketState.assignedTo}
        onChange={(e) =>
          setTicketState({ ...ticketState, assignedTo: e.target.value })
        }
      />
    );
  }

  function renderTicketFilters() {
    return (
      <div className="ticket-filters">
        <div className="filter-group search-filter">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Priority</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Network">Network</option>
            <option value="Account Access">Account Access</option>
            <option value="Email">Email</option>
            <option value="Security">Security</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Assigned</label>
          <select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
          >
            <option value="All">All Assigned</option>
            {assignedOptions.map((assignedTo) => (
              <option key={assignedTo} value={assignedTo}>
                {assignedTo}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button type="button" onClick={clearTicketFilters}>
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  function renderTicketContent() {
    return (
      <>
        <div className="toolbar">
          <button onClick={() => loadTickets()}>Refresh Tickets</button>
        </div>

        <form className="create-form" onSubmit={createTicket}>
          <h2>Create Ticket</h2>

          <input
            placeholder="Title"
            value={newTicket.title}
            onChange={(e) =>
              setNewTicket({ ...newTicket, title: e.target.value })
            }
          />

          <input
            placeholder="Description"
            value={newTicket.description}
            onChange={(e) =>
              setNewTicket({ ...newTicket, description: e.target.value })
            }
          />

          <select
            value={newTicket.priority}
            onChange={(e) =>
              setNewTicket({ ...newTicket, priority: e.target.value })
            }
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            value={newTicket.category}
            onChange={(e) =>
              setNewTicket({ ...newTicket, category: e.target.value })
            }
          >
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Network">Network</option>
            <option value="Account Access">Account Access</option>
            <option value="Email">Email</option>
            <option value="Security">Security</option>
            <option value="Other">Other</option>
          </select>

          <input
            placeholder="Requester"
            value={newTicket.requester}
            onChange={(e) =>
              setNewTicket({ ...newTicket, requester: e.target.value })
            }
          />

          {renderAssignedToField(newTicket, setNewTicket)}

          <button type="submit">Create Ticket</button>
        </form>

        {renderTicketFilters()}

        <p className="filter-summary">
          Showing {filteredTickets.length} of {tickets.length} ticket(s)
        </p>

        <div className="ticket-grid">
          {filteredTickets.length === 0 ? (
            <p>No tickets found.</p>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                userRole={userRole}
                openTicketModal={openTicketModal}
                updateTicketStatus={updateTicketStatus}
                deleteTicket={deleteTicket}
              />
            ))
          )}
        </div>
      </>
    );
  }

  function renderDashboardView() {
    return (
      <div className="dashboard">
        <div className="topbar">
          <div>
            <h1>HelpDesk Dashboard</h1>
            <p className="dashboard-subtitle">
              Manage support tickets, assignments, and ticket status.
            </p>
          </div>

          <div className="user-actions">
            <span>
              {userEmail} ({userRole})
            </span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <span>Total Tickets</span>
            <strong>{tickets.length}</strong>
          </div>

          <div className="stat-card">
            <span>Open</span>
            <strong>{openTickets}</strong>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <strong>{inProgressTickets}</strong>
          </div>

          <div className="stat-card">
            <span>Resolved</span>
            <strong>{resolvedTickets}</strong>
          </div>
        </div>

        {message && <p className="message">{message}</p>}

        {renderTicketContent()}
      </div>
    );
  }

  function renderTicketsView() {
    return (
      <div className="dashboard">
        <div className="topbar">
          <div>
            <h1>Tickets</h1>
            <p className="dashboard-subtitle">
              Create, search, filter, update, and assign support tickets.
            </p>
          </div>

          <div className="user-actions">
            <span>
              {userEmail} ({userRole})
            </span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        {message && <p className="message">{message}</p>}

        {renderTicketContent()}
      </div>
    );
  }

  function renderUsersView() {
    return (
      <div className="dashboard">
        <div className="topbar">
          <div>
            <h1>Users</h1>
            <p className="dashboard-subtitle">
              Add users and manage admin or technician roles.
            </p>
          </div>

          <div className="user-actions">
            <button onClick={() => loadUsers()}>Refresh Users</button>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        {message && <p className="message">{message}</p>}

        <div className="stats-row">
          <div className="stat-card">
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>

          <div className="stat-card">
            <span>Admins</span>
            <strong>{adminUsers}</strong>
          </div>

          <div className="stat-card">
            <span>Technicians</span>
            <strong>{technicianUsers}</strong>
          </div>

          <div className="stat-card">
            <span>Current Role</span>
            <strong>{userRole}</strong>
          </div>
        </div>

        <form className="create-form user-create-form" onSubmit={createUser}>
          <h2>Add User</h2>

          <input
            placeholder="Full Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Temporary Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />

          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="technician">Technician</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Add User</button>
        </form>

        {usersLoading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="user-list">
            {users.map((user) => (
              <div className="user-card" key={user.id}>
                <div className="user-card-main">
                  <div className="user-avatar">
                    {user.name
                      ? user.name.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="user-card-details">
                  <span className={`user-role-badge role-${user.role}`}>
                    {user.role}
                  </span>

                  <select
                    className="role-select"
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                  >
                    <option value="technician">Technician</option>
                    <option value="admin">Admin</option>
                  </select>

                  <p>
                    Joined:{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderKnowledgeBaseView() {
    return (
      <div className="dashboard">
        <div className="topbar">
          <div>
            <h1>Knowledge Base</h1>
            <p className="dashboard-subtitle">
              Search internal support articles and troubleshooting guides.
            </p>
          </div>

          <div className="user-actions">
            <button onClick={() => loadKnowledgeArticles()}>
              Refresh Articles
            </button>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        {message && <p className="message">{message}</p>}

        {userRole === "admin" && (
          <form
            className="create-form knowledge-create-form"
            onSubmit={createKnowledgeArticle}
          >
            <h2>Create Article</h2>

            <input
              placeholder="Article Title"
              value={newArticle.title}
              onChange={(e) =>
                setNewArticle({ ...newArticle, title: e.target.value })
              }
            />

            <select
              value={newArticle.category}
              onChange={(e) =>
                setNewArticle({ ...newArticle, category: e.target.value })
              }
            >
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Network">Network</option>
              <option value="Account Access">Account Access</option>
              <option value="Email">Email</option>
              <option value="Security">Security</option>
              <option value="Other">Other</option>
            </select>

            <textarea
              placeholder="Article content, troubleshooting steps, or resolution notes"
              value={newArticle.content}
              onChange={(e) =>
                setNewArticle({ ...newArticle, content: e.target.value })
              }
            />

            <button type="submit">Create Article</button>
          </form>
        )}

        <div className="knowledge-filters">
          <div className="filter-group search-filter">
            <label>Search Articles</label>
            <input
              type="text"
              placeholder="Search by title, category, content, or author..."
              value={knowledgeSearchTerm}
              onChange={(e) => setKnowledgeSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={knowledgeCategoryFilter}
              onChange={(e) => setKnowledgeCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {knowledgeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="filter-summary">
          Showing {filteredKnowledgeArticles.length} of{" "}
          {knowledgeArticles.length} article(s)
        </p>

        {knowledgeLoading ? (
          <p>Loading knowledge base...</p>
        ) : filteredKnowledgeArticles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <div className="knowledge-grid">
            {filteredKnowledgeArticles.map((article) => (
              <KnowledgeArticleCard
                key={article.id}
                article={article}
                userRole={userRole}
                openArticleModal={openArticleModal}
                deleteKnowledgeArticle={deleteKnowledgeArticle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderAuditLogsView() {
    return (
      <div className="dashboard">
        <div className="topbar">
          <div>
            <h1>Audit Logs</h1>
            <p className="dashboard-subtitle">
              Review ticket activity, admin actions, and security events.
            </p>
          </div>

          <div className="user-actions">
            <button onClick={loadAuditLogs}>Refresh Logs</button>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        {message && <p className="message">{message}</p>}

        {auditLoading ? (
          <p>Loading audit logs...</p>
        ) : auditLogs.length === 0 ? (
          <p>No audit logs found.</p>
        ) : (
          <div className="audit-log-list">
            {auditLogs.map((log) => (
              <div className="audit-log-card" key={log.id}>
                <div className="audit-log-header">
                  <div>
                    <h3>{log.action}</h3>
                    <p>
                      <strong>User:</strong>{" "}
                      {log.userEmail || "System / Unknown"}
                    </p>
                  </div>

                  <span className="audit-role-badge">{log.role || "N/A"}</span>
                </div>

                <p>
                  <strong>Ticket ID:</strong> {log.ticketId || "N/A"}
                </p>

                <p>
                  <strong>Details:</strong>{" "}
                  {log.details || "No details provided"}
                </p>

                <p className="audit-log-date">
                  {log.createdAt
                    ? new Date(log.createdAt).toLocaleString()
                    : "No timestamp"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderActiveView() {
    if (activeView === "dashboard") {
      return renderDashboardView();
    }

    if (activeView === "tickets") {
      return renderTicketsView();
    }

    if (activeView === "users" && userRole === "admin") {
      return renderUsersView();
    }

    if (activeView === "auditLogs" && userRole === "admin") {
      return renderAuditLogsView();
    }

    if (activeView === "knowledgeBase") {
      return renderKnowledgeBaseView();
    }

    return renderDashboardView();
  }

  if (token) {
    return (
      <div className="app-shell">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          userEmail={userEmail}
          userRole={userRole}
        />

        <main className="page">
          {renderActiveView()}

          <TicketModal
            selectedTicket={selectedTicket}
            editTicket={editTicket}
            setEditTicket={setEditTicket}
            closeModal={closeModal}
            saveTicketChanges={saveTicketChanges}
            deleteTicket={deleteTicket}
            userRole={userRole}
            renderAssignedToField={renderAssignedToField}
          />

          <ArticleModal
            selectedArticle={selectedArticle}
            editArticle={editArticle}
            setEditArticle={setEditArticle}
            closeArticleModal={closeArticleModal}
            saveKnowledgeArticle={saveKnowledgeArticle}
            deleteKnowledgeArticle={deleteKnowledgeArticle}
            userRole={userRole}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="login-card">
        <h1>HelpDesk Login</h1>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;