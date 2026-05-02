function TicketModal({
  selectedTicket,
  editTicket,
  setEditTicket,
  closeModal,
  saveTicketChanges,
  deleteTicket,
  userRole,
  renderAssignedToField
}) {
  if (!selectedTicket || !editTicket) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="ticket-modal">
        <div className="modal-header">
          <div>
            <h2>Ticket #{selectedTicket.id}</h2>
            <p>Edit ticket details below.</p>
          </div>

          <button className="modal-close-button" onClick={closeModal}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={saveTicketChanges}>
          <label>Title</label>
          <input
            value={editTicket.title}
            onChange={(e) =>
              setEditTicket({ ...editTicket, title: e.target.value })
            }
          />

          <label>Description</label>
          <textarea
            value={editTicket.description}
            onChange={(e) =>
              setEditTicket({
                ...editTicket,
                description: e.target.value
              })
            }
          />

          <div className="modal-form-row">
            <div>
              <label>Status</label>
              <select
                value={editTicket.status}
                onChange={(e) =>
                  setEditTicket({
                    ...editTicket,
                    status: e.target.value
                  })
                }
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </div>

            <div>
              <label>Priority</label>
              <select
                value={editTicket.priority}
                onChange={(e) =>
                  setEditTicket({
                    ...editTicket,
                    priority: e.target.value
                  })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <label>Category</label>
          <select
            value={editTicket.category}
            onChange={(e) =>
              setEditTicket({
                ...editTicket,
                category: e.target.value
              })
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

          <label>Requester</label>
          <input
            value={editTicket.requester}
            onChange={(e) =>
              setEditTicket({
                ...editTicket,
                requester: e.target.value
              })
            }
          />

          <label>Assigned To</label>
          {renderAssignedToField(editTicket, setEditTicket)}

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={closeModal}>
              Cancel
            </button>

            {userRole === "admin" && (
              <button
                type="button"
                className="modal-delete-button"
                onClick={() => deleteTicket(editTicket.id)}
              >
                Delete
              </button>
            )}

            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketModal;