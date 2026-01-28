function ProductModal({
  modalType,
  modalTitle,
  templateData,
  onCloseModal,
  onInputChange,
  onImageChange,
  onFileChange,
  onSubmit,
}) {
  return (
    <div className="modal fade" id="productModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5">{modalTitle}</h2>
            <button type="button" className="btn-close" aria-label="Close" onClick={onCloseModal}></button>
          </div>
          <div className="modal-body">
            {modalType === "delete" ? (
              <p className="mb-0">
                確定要刪除 <strong>{templateData.title}</strong> 嗎？此操作無法復原。
              </p>
            ) : (
              <form className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="title">
                    產品名稱
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="form-control"
                    value={templateData.title}
                    onChange={onInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="category">
                    分類
                  </label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    className="form-control"
                    value={templateData.category}
                    onChange={onInputChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="unit">
                    單位
                  </label>
                  <input
                    id="unit"
                    name="unit"
                    type="text"
                    className="form-control"
                    value={templateData.unit}
                    onChange={onInputChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="origin_price">
                    原價
                  </label>
                  <input
                    id="origin_price"
                    name="origin_price"
                    type="number"
                    className="form-control"
                    value={templateData.origin_price}
                    onChange={onInputChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="price">
                    售價
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    className="form-control"
                    value={templateData.price}
                    onChange={onInputChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="description">
                    產品描述
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows="2"
                    value={templateData.description}
                    onChange={onInputChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="content">
                    說明內容
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    className="form-control"
                    rows="2"
                    value={templateData.content}
                    onChange={onInputChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="imageUrl">
                    主要圖片
                  </label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="text"
                    className="form-control"
                    value={templateData.imageUrl}
                    onChange={onInputChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="fileInput">
                    圖片上傳
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    id="fileInput"
                    onChange={onFileChange}
                  />
                </div>
                <div className="col-12">
                  <p className="my-2">or</p>
                </div>
                <div className="col-12">
                  <label className="form-label">其他圖片</label>
                  <div className="d-flex flex-column gap-2">
                    {templateData.imagesUrl.map((url, index) => (
                      <input
                        key={`image-${index}`}
                        type="text"
                        className="form-control"
                        value={url}
                        onChange={(event) => onImageChange(index, event.target.value)}
                        placeholder={`圖片連結 ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input
                      id="is_enabled"
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      checked={templateData.is_enabled}
                      onChange={onInputChange}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onCloseModal}>
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={onSubmit}>
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
