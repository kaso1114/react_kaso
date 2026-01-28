import { useEffect, useState } from "react";
import axios from "axios";
import { currency } from "../../utils/filter";

const API_BASE =
  import.meta.env.VITE_API ??
  import.meta.env.VITE_API_BASE ??
  "https://ec-course-api.hexschool.io/v2";
const API_PATH =
  import.meta.env.VITE_APIPATH ??
  import.meta.env.VITE_API_PATH ??
  "kaso1114";

const Cart = () => {
  const [cart, setCart] = useState({ carts: [], total: 0, final_total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getCart = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      const response = await axios.get(url);
      setCart(response.data.data || { carts: [], total: 0, final_total: 0 });
    } catch (error) {
      console.log(error.response?.data || error);
      setErrorMessage("取得購物車失敗，請稍後再試。 ");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCart = async (id) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${id}`;
      await axios.delete(url);
      getCart();
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  const deleteCartAll = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/carts`;
      await axios.delete(url);
      getCart();
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="container">
      <h2>購物車列表</h2>
      {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={deleteCartAll}
          disabled={cart.carts.length === 0 || isLoading}
        >
          清空購物車
        </button>
      </div>
      <div className="table-responsive mt-3">
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">品名</th>
              <th scope="col">數量/單位</th>
              <th scope="col" className="text-end">
                小計
              </th>
            </tr>
          </thead>
          <tbody>
            {cart.carts.length === 0 && !isLoading ? (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  購物車目前是空的。
                </td>
              </tr>
            ) : (
              cart.carts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteCart(item.id)}
                    >
                      刪除
                    </button>
                  </td>
                  <th scope="row">{item.product?.title}</th>
                  <td>
                    {item.qty} / {item.product?.unit}
                  </td>
                  <td className="text-end">{currency(item.total)}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-end" colSpan="3">
                總計
              </td>
              <td className="text-end">{currency(cart.total)}</td>
            </tr>
            <tr>
              <td className="text-end" colSpan="3">
                折扣價
              </td>
              <td className="text-end">{currency(cart.final_total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Cart;
