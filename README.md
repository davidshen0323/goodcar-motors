# 好車選品 — 外匯車選品

技術組合：**React + TypeScript + Tailwind CSS**。
獨立的 React + Vite 汽車網站作品，包含雙語車源前台與本機營運管理。

[English](README.en.md) · [架構](docs/ARCHITECTURE.md) · [操作指南](docs/REVIEW_GUIDE.md)

## 啟動

使用 Node.js 22 或更新的 LTS 版本。

```bash
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
```

前台 `/`，管理頁 `/admin.html`。正式建置會產生獨立的 `admin.html`，可部署到一般靜態網站主機。

## 功能

- 車源搜尋（編號、名稱、年份、sedan/suv/coupe）、車型／預算篩選、價格與年份排序。
- 車輛詳情、可持續保存的收藏、最多三台車的比較。
- 等額本息月付試算，含零利率、自備款及期數驗證。
- 購車詢問保存車輛名稱與價格快照，於管理頁追蹤狀態與處理時間。
- 新增／編輯車源，設定可預約、洽談中、已售出；已售出車輛從前台隱藏。
- 詢問管理：新詢問 → 已聯絡 → 已結案，或直接結案。結案後鎖定；匯出目前篩選的 CSV。
- 售車需求預覽（不保存、不送出）。
- 繁中／英文切換，網址與本機偏好保留語言設定。

## 範圍

這是可操作的前端概念作品。車源、規格及售價為示意資料，圖片為 AI 生成；不代表任何車商的實際在售車輛。沒有登入驗證、伺服器資料庫、金流、真實預約或寄信。管理頁不是權限邊界。詢問與車源儲存在目前瀏覽器，同來源分頁會同步，無法跨裝置共用。請使用測試聯絡資料。

清除瀏覽器網站資料會清除本機詢問、收藏與編輯過的車源。若本機儲存失敗，畫面會回報錯誤。

## GitHub

建議 repository 名稱：`goodcar-motors`。

Description: Bilingual automotive collection built with React and Vite, featuring inventory search, vehicle comparison and local inquiry management.

原始碼包不含 node_modules、建置檔、Git metadata 或測試時建立的瀏覽器資料。`.openai/hosting.json` 為目前展示網站的識別設定；若自行部署到其他主機，可移除該目錄。不要將這個 Site 的識別複製到另一個新 Site。

## 驗證

14 項測試涵蓋資料驗證、售出車源篩選、比較數量上限、詢問快照／狀態歷程、零利率試算、CSV 跳脫、HTTP 環境 ID 相容性，以及前後台操作整合。
