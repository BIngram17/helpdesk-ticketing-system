function Sidebar({ activeView, setActiveView, userEmail, userRole }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">HD</div>
        <div>
          <h2>HelpDesk</h2>
          <p>Support Portal</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-link ${activeView === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveView("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={`sidebar-link ${activeView === "tickets" ? "active" : ""}`}
          onClick={() => setActiveView("tickets")}
        >
          Tickets
        </button>

        <button
          className={`sidebar-link ${
            activeView === "knowledgeBase" ? "active" : ""
          }`}
          onClick={() => setActiveView("knowledgeBase")}
        >
          Knowledge Base
        </button>

        {userRole === "admin" && (
          <>
            <div className="sidebar-section-title">Admin</div>

            <button
              className={`sidebar-link ${activeView === "users" ? "active" : ""}`}
              onClick={() => setActiveView("users")}
            >
              Users
            </button>

            <button
              className={`sidebar-link ${
                activeView === "auditLogs" ? "active" : ""
              }`}
              onClick={() => setActiveView("auditLogs")}
            >
              Audit Logs
            </button>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <p>Signed in as</p>
        <strong>{userEmail}</strong>
        <span>{userRole}</span>
      </div>
    </aside>
  );
}

export default Sidebar;