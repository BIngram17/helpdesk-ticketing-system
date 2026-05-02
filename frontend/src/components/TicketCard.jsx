function TicketCard({
  ticket,
  userRole,
  openTicketModal,
  updateTicketStatus,
  deleteTicket
}) {
  return (
    <div className="ticket-card">
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>

      <p>
        <strong>Status:</strong>{" "}
        <span className={`badge status-${ticket.status.replace(" ", "-")}`}>
          {ticket.status}
        </span>
      </p>

      <p>
        <strong>Priority:</strong>{" "}
        <span className={`badge priority-${ticket.priority}`}>
          {ticket.priority}
        </span>
      </p>

      <p>
        <strong>Category:</strong> {ticket.category}
      </p>

      <p>
        <strong>Requester:</strong> {ticket.requester}
      </p>

      <p>
        <strong>Assigned:</strong> {ticket.assignedTo || "Unassigned"}
      </p>

      <button
        className="view-edit-button"
        onClick={() => openTicketModal(ticket)}
      >
        View / Edit
      </button>

      <div className="status-actions">
        <button onClick={() => updateTicketStatus(ticket.id, "Open")}>
          Open
        </button>

        <button onClick={() => updateTicketStatus(ticket.id, "In Progress")}>
          In Progress
        </button>

        <button onClick={() => updateTicketStatus(ticket.id, "Resolved")}>
          Resolved
        </button>

        <button onClick={() => updateTicketStatus(ticket.id, "Closed")}>
          Closed
        </button>
      </div>

      {userRole === "admin" && (
        <button
          className="delete-button"
          onClick={() => deleteTicket(ticket.id)}
        >
          Delete Ticket
        </button>
      )}
    </div>
  );
}

export default TicketCard;