# 產品管理（Vite + React）

單頁式產品管理後台，包含權限檢查、產品列表與 CRUD 操作，並使用 Bootstrap 5 的 Modal 與按鈕群組。

## 需求重點

- Cookie 內的 `hexToken` 會用來進行管理員驗證
- API 來源由 `.env` 內的 `VITE_API_BASE` 設定
- API 路徑固定為 `kaso1114`

## 開發指令

- `npm install`
- `npm run dev`

## 環境變數

建立或確認 `.env` 內有以下設定：

```
VITE_API_BASE=https://ec-course-api.hexschool.io/v2
```
