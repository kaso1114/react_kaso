import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API ??
  import.meta.env.VITE_API_BASE ??
  "https://ec-course-api.hexschool.io/v2";
const API_PATH =
  import.meta.env.VITE_APIPATH ??
  import.meta.env.VITE_API_PATH ??
  "kaso1114";

const SingleProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(
    location.state?.productData?.product ?? null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [notice, setNotice] = useState("");

  const productId = useMemo(() => product?.id ?? id, [product, id]);

  const getProduct = async (productIdValue) => {
    if (!productIdValue) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/product/${productIdValue}`
      );
      setProduct(res?.data?.product ?? null);
    } catch (error) {
      console.error("取得產品資料失敗", error);
      setErrorMessage("取得產品資料失敗，請稍後再試。 ");
    } finally {
      setIsLoading(false);
    }
  };

  const addCart = async (productIdValue, qty = 1) => {
    if (!productIdValue) return;
    setIsAdding(true);
    setNotice("");
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      const data = {
        product_id: productIdValue,
        qty,
      };
      await axios.post(url, { data });
      setNotice("已加入購物車！");
      navigate("/cart");
    } catch (error) {
      console.log(error.response?.data || error);
      setNotice("加入購物車失敗，請稍後再試。 ");
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!productId) return;
    if (product && product.id === productId) return;
    getProduct(productId);
  }, [productId]);

  if (isLoading) {
    return <p className="text-muted">載入中...</p>;
  }

  if (!product) {
    return <div>沒有可用的產品資料。</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card" style={{ width: "20rem" }}>
        <img
          src={product.imageUrl}
          className="card-img-top"
          alt={product.title}
        />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text">
            <strong>分類:</strong> {product.category}
          </p>
          <p className="card-text">
            <strong>單位:</strong> {product.unit}
          </p>
          <p className="card-text">
            <strong>原價:</strong> {product.origin_price} 元
          </p>
          <p className="card-text">
            <strong>現價:</strong> {product.price} 元
          </p>
          {errorMessage && (
            <div className="alert alert-warning">{errorMessage}</div>
          )}
          {notice && <div className="alert alert-info">{notice}</div>}
          <button
            className="btn btn-primary"
            onClick={() => addCart(product.id, 1)}
            disabled={isAdding}
          >
            {isAdding ? "加入中..." : "立即購買"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
