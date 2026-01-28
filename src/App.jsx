import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import Pagination from "./components/Pagination";
import ProductModal from "./components/ProductModal";

const API_BASE = import.meta.env.VITE_API_BASE ?? "https://ec-course-api.hexschool.io/v2";
const DEFAULT_API_PATH = import.meta.env.VITE_API_PATH ?? "kaso1114";

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [""],
};

function App() {
  const productModalRef = useRef(null);
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [modalType, setModalType] = useState("");
  const [templateData, setTemplateData] = useState(INITIAL_TEMPLATE_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [apiPath, setApiPath] = useState(DEFAULT_API_PATH);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const modalTitle = useMemo(() => {
    if (modalType === "create") return "新增產品";
    if (modalType === "edit") return "編輯產品";
    if (modalType === "delete") return "刪除產品";
    return "產品管理";
  }, [modalType]);

  const normalizeProductData = (data) => {
    const imagesUrl = Array.isArray(data.imagesUrl)
      ? data.imagesUrl.filter((url) => url)
      : [];

    return {
      ...data,
      origin_price: data.origin_price === "" ? 0 : Number(data.origin_price),
      price: data.price === "" ? 0 : Number(data.price),
      imagesUrl,
    };
  };

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
      setAuthMessage("");
      await getProductData();
    } catch (error) {
      console.log("權限檢查失敗：", error?.response?.data?.message || error.message);
      setIsAuth(false);
      setAuthMessage("尚未通過權限驗證，請重新登入。 ");
    }
  };

  const getProductData = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/${apiPath}/admin/products`, {
        params: { page },
      });
      const productList = response?.data?.products ?? [];
      const paginationData = response?.data?.pagination ?? {};
      setProducts(Object.values(productList));
      setPagination(paginationData);
    } catch (error) {
      console.log("取得產品列表失敗：", error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (product, type) => {
    if (type === "create") {
      setTemplateData(INITIAL_TEMPLATE_DATA);
    } else {
      const imagesUrl = Array.isArray(product?.imagesUrl) ? [...product.imagesUrl] : [];
      if (imagesUrl.length === 0 || imagesUrl[imagesUrl.length - 1] !== "") {
        imagesUrl.push("");
      }

      setTemplateData({
        ...INITIAL_TEMPLATE_DATA,
        ...product,
        imagesUrl,
      });
    }

    setModalType(type);
    productModalRef.current?.show();
  };

  const closeModal = () => {
    productModalRef.current?.hide();
  };

  const handleModalInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setTemplateData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages[index] = value;

      if (value !== "" && index === newImages.length - 1 && newImages.length < 5) {
        newImages.push("");
      }

      if (value === "" && newImages.length > 1 && newImages[newImages.length - 1] === "") {
        const lastValue = newImages[newImages.length - 2];
        if (lastValue === "") {
          newImages.pop();
        }
      }

      return { ...prevData, imagesUrl: newImages };
    });
  };

  const handleSubmit = async () => {
    if (modalType === "delete") {
      try {
        await axios.delete(`${API_BASE}/api/${apiPath}/admin/product/${templateData.id}`);
        closeModal();
        await getProductData();
      } catch (error) {
        console.log("刪除產品失敗：", error?.response?.data?.message || error.message);
      }
      return;
    }

    const payload = normalizeProductData(templateData);
    try {
      if (modalType === "create") {
        await axios.post(`${API_BASE}/api/${apiPath}/admin/product`, { data: payload });
      } else if (modalType === "edit") {
        await axios.put(`${API_BASE}/api/${apiPath}/admin/product/${templateData.id}`, { data: payload });
      }
      closeModal();
      await getProductData();
    } catch (error) {
      console.log("送出產品失敗：", error?.response?.data?.message || error.message);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);

      const response = await axios.post(`${API_BASE}/api/${apiPath}/admin/upload`, formData);
      const uploadedImageUrl = response?.data?.imageUrl;

      if (uploadedImageUrl) {
        setTemplateData((prevData) => ({
          ...prevData,
          imageUrl: uploadedImageUrl,
        }));
      }
    } catch (error) {
      console.log("上傳圖片失敗：", error?.response?.data?.message || error.message);
    }
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsAuthLoading(true);
    setAuthMessage("");

    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, loginForm);
      const { token, expired } = response?.data ?? {};

      if (token) {
        document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
        axios.defaults.headers.common.Authorization = token;
        await checkAdmin();
      } else {
        setAuthMessage("登入失敗，請確認帳號密碼。 ");
      }
    } catch (error) {
      console.log("登入失敗：", error?.response?.data?.message || error.message);
      setAuthMessage("登入失敗，請確認帳號密碼。 ");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    delete axios.defaults.headers.common.Authorization;
    setIsAuth(false);
    setProducts([]);
    setPagination({});
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      axios.defaults.headers.common.Authorization = token;
    }

    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    const modalElement = document.querySelector("#productModal");
    modalElement?.addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });

    if (token) {
      checkAdmin();
    } else {
      setIsAuth(false);
      setAuthMessage("尚未通過權限驗證，請重新登入。 ");
    }
  }, []);

  return (
    <div className="container py-4">
      <header className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1">產品管理</h1>
        </div>
        {isAuth && (
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={handleLogout}>
              登出
            </button>
            <button type="button" className="btn btn-primary" onClick={() => openModal({}, "create")}>
              建立新的產品
            </button>
          </div>
        )}
      </header>

      {!isAuth ? (
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h5 mb-2">管理員登入</h2>
            {authMessage && <div className="alert alert-warning">{authMessage}</div>}
            <form className="row g-3" onSubmit={handleLogin}>
              <div className="col-md-6">
                <label className="form-label" htmlFor="username">
                  帳號（Email）
                </label>
                <input
                  id="username"
                  name="username"
                  type="email"
                  className="form-control"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="password">
                  密碼
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="請輸入密碼"
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="apiPath">
                  API_PATH
                </label>
                <input
                  id="apiPath"
                  name="apiPath"
                  type="text"
                  className="form-control"
                  value={apiPath}
                  onChange={(event) => setApiPath(event.target.value)}
                  placeholder="請輸入 API_PATH"
                  required
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary" disabled={isAuthLoading}>
                  {isAuthLoading ? "登入中..." : "登入"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>分類</th>
                    <th className="text-end">原價</th>
                    <th className="text-end">售價</th>
                    <th className="text-center">狀態</th>
                    <th className="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">{item.title}</td>
                      <td>{item.category}</td>
                      <td className="text-end">{item.origin_price}</td>
                      <td className="text-end">{item.price}</td>
                      <td className="text-center">
                        <span className={item.is_enabled ? "text-success" : "text-muted"}>
                          {item.is_enabled ? "啟用" : "未啟用"}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group" role="group" aria-label="產品操作">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => openModal(item, "edit")}
                          >
                            編輯
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => openModal(item, "delete")}
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isLoading && <div className="text-center text-muted py-3">載入中...</div>}
            </div>
            <Pagination pagination={pagination} changePage={getProductData} />
          </div>
        </div>
      )}
      <ProductModal
        modalType={modalType}
        modalTitle={modalTitle}
        templateData={templateData}
        onCloseModal={closeModal}
        onInputChange={handleModalInputChange}
        onImageChange={handleImageChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
