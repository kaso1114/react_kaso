function Pagination({ pagination, changePage }) {
  const handleClick = (event, page) => {
    event.preventDefault();
    changePage(page);
  };

  if (!pagination || pagination.total_pages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <a
            href="/"
            aria-label="Previous"
            className={`page-link ${pagination.has_pre ? "" : "disabled"}`}
            onClick={(event) => handleClick(event, pagination.current_page - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {Array.from({ length: pagination.total_pages }, (_, i) => (
          <li className="page-item" key={`${i}_page`}>
            <a
              className={`page-link ${i + 1 === pagination.current_page ? "active" : ""}`}
              href="/"
              onClick={(event) => handleClick(event, i + 1)}
            >
              {i + 1}
            </a>
          </li>
        ))}
        <li className="page-item">
          <a
            href="/"
            aria-label="Next"
            className={`page-link ${pagination.has_next ? "" : "disabled"}`}
            onClick={(event) => handleClick(event, pagination.current_page + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
