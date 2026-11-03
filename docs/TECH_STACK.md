# 技術組合與遷移範圍

React + TypeScript + Tailwind CSS

應用程式來源已由 JavaScript/JSX 改為 TypeScript/TSX。`tsconfig.json` 啟用 strict，涵蓋 src 中的資料模型、元件、Hooks、業務規則與儲存介面。沒有使用 ts-ignore、ts-nocheck 或關閉 noImplicitAny 來略過遷移錯誤。

`npm run typecheck` 執行 tsc --noEmit，正式建置也會先檢查型別。既有 Vitest 測試保留，測試檔仍採 JavaScript/JSX；型別檢查目前涵蓋應用程式來源。

Tailwind CSS 經由 Vite plugin 編譯。`src/tailwind.css` 宣告 theme 與 utilities layers；主要網格、Flex 版面、間距、卡片與 RWD 改用元件內的 utility classes。為維持既有品牌外觀，字體、色彩、背景圖、特殊細節與部分管理頁樣式仍保留 CSS；這不是宣稱已移除所有 CSS 的重寫。

沒有引入額外狀態管理框架；本機互動使用有型別的 React Hooks 與 localStorage。

這次不變更資料儲存鍵，也不新增正式登入、金流或遠端資料庫。下載包會排除展示站的託管設定，執行不依賴 Sites。
