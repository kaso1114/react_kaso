import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API ??
  import.meta.env.VITE_API_BASE ??
  "https://ec-course-api.hexschool.io/v2";
const API_PATH =
  import.meta.env.VITE_APIPATH ??
  import.meta.env.VITE_API_PATH ??
  "kaso1114";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getProducts = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
      setProducts(res?.data?.products ?? []);
    } catch (error) {
      console.error("取得產品資料失敗", error);
      setErrorMessage("取得產品資料失敗，請稍後再試。 ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMore = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      navigate(`/product/${id}`, { state: { productData: res.data } });
    } catch (error) {
      console.error("取得產品資料失敗", error);
      setErrorMessage("取得產品資料失敗，請稍後再試。 ");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <h2 className="mb-4">產品列表</h2>
      {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
      {isLoading ? (
        <p className="text-muted">載入中...</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-3" key={product.id}>
              <div className="card h-100">
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt={product.title}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text text-muted">{product.description}</p>
                  <p className="card-text">
                    <strong>價格:</strong> {product.price} 元
                  </p>
                  <p className="card-text">
                    <small className="text-muted">單位: {product.unit}</small>
                  </p>
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => handleViewMore(product.id)}
                  >
                    查看更多
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
