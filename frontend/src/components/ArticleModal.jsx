function ArticleModal({
  selectedArticle,
  editArticle,
  setEditArticle,
  closeArticleModal,
  saveKnowledgeArticle,
  deleteKnowledgeArticle,
  userRole
}) {
  if (!selectedArticle || !editArticle) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="ticket-modal">
        <div className="modal-header">
          <div>
            <h2>Article #{selectedArticle.id}</h2>
            <p>
              {userRole === "admin"
                ? "Edit knowledge base article."
                : "View knowledge base article."}
            </p>
          </div>

          <button className="modal-close-button" onClick={closeArticleModal}>
            ×
          </button>
        </div>

        {userRole === "admin" ? (
          <form className="modal-form" onSubmit={saveKnowledgeArticle}>
            <label>Title</label>
            <input
              value={editArticle.title}
              onChange={(e) =>
                setEditArticle({
                  ...editArticle,
                  title: e.target.value
                })
              }
            />

            <label>Category</label>
            <select
              value={editArticle.category}
              onChange={(e) =>
                setEditArticle({
                  ...editArticle,
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

            <label>Content</label>
            <textarea
              value={editArticle.content}
              onChange={(e) =>
                setEditArticle({
                  ...editArticle,
                  content: e.target.value
                })
              }
            />

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={closeArticleModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="modal-delete-button"
                onClick={() => deleteKnowledgeArticle(editArticle.id)}
              >
                Delete
              </button>

              <button type="submit">Save Article</button>
            </div>
          </form>
        ) : (
          <div className="article-read-view">
            <span className="knowledge-category-badge">
              {selectedArticle.category}
            </span>
            <h3>{selectedArticle.title}</h3>
            <p>{selectedArticle.content}</p>
            <p className="knowledge-meta">
              Author: {selectedArticle.authorEmail || "Unknown"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleModal;