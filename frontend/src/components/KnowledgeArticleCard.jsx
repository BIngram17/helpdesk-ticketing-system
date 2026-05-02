function KnowledgeArticleCard({
  article,
  userRole,
  openArticleModal,
  deleteKnowledgeArticle
}) {
  return (
    <div className="knowledge-card">
      <div className="knowledge-card-header">
        <h3>{article.title}</h3>
        <span className="knowledge-category-badge">{article.category}</span>
      </div>

      <p className="knowledge-preview">{article.content}</p>

      <p className="knowledge-meta">
        Author: {article.authorEmail || "Unknown"}
      </p>

      <p className="knowledge-meta">
        Updated:{" "}
        {article.updatedAt
          ? new Date(article.updatedAt).toLocaleString()
          : "N/A"}
      </p>

      <button
        className="view-edit-button"
        onClick={() => openArticleModal(article)}
      >
        {userRole === "admin" ? "View / Edit" : "View Article"}
      </button>

      {userRole === "admin" && (
        <button
          className="delete-button"
          onClick={() => deleteKnowledgeArticle(article.id)}
        >
          Delete Article
        </button>
      )}
    </div>
  );
}

export default KnowledgeArticleCard;