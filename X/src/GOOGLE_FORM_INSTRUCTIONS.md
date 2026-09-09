# 在 Google 表單 建立遊戲回饋表單（步驟與欄位對應）

以下為完整步驟，請依照指示在 Google 表單建立表單，建立完成後取得「分享連結」，並把連結貼回遊戲中的浮動按鈕（預設在 `calculator.html`，按鈕 href 為 `feedback.html`）。

1. 前往 https://forms.google.com 或 drive.google.com → 新增 → 更多 → Google 表單
2. 表單標題：遊戲回饋表單
3. 欄位（建議設定）
   - 姓名 (短答案) — 欄位說明：選填
   - Email / 聯絡方式 (短答案) — 設為 email 格式（或短答案），選填
   - 其他聯絡方式 (短答案) — 選填（可放 LINE/電話）
   - 遊玩體驗 (段落) — 讓玩家描述他們的遊玩經驗
   - 意見 / 建議 (段落) — 文字回饋
   - 遊戲評分 (選擇題) — 選項：1、2、3、4、5（可用星號文字或數字）；建議把 1 最差、5 最好

4. 設定（右上齒輪）
   - 若你需要收集回應者的 Email，可在「一般」或回應選項中設定，但注意隱私與法規（如需記名請註明）
   - 如果表單要匿名回饋，請不要勾選自動收集電子郵件

5. 完成表單後，點右上「傳送」→ 選擇鏈結圖示 → 複製短連結

6. 把複製的連結貼回遊戲程式碼
   - 檔案：`D:/eclipse/eclipse-workspace/X/src/calculator.html`
   - 在 HTML 中找到浮動按鈕（`<a class="feedback-button" id="feedbackLink" ...>`）
   - 把 href 的值（目前為 `feedback.html`）替換為你的 Google 表單分享連結，例如：

```html
<a class="feedback-button" id="feedbackLink" href="https://forms.gle/xxxxxxxx" target="_blank" title="給我們回饋">✉</a>
```

7. 儲存並重新載入遊戲頁面，玩家點按浮動按鈕會在新分頁開啟 Google 表單。

欄位對應建議（方便日後匯出 CSV 或對應後端）
 - name
 - email
 - contact
 - experience
 - opinion
 - rating

備註
 - 如果你想直接把回饋存到你的伺服器，請建立一個後端接受 POST 請求的 API，並把 `calculator.html` 的按鈕改為打開一個自訂回饋頁面，或把表單改為直接 POST 到你的 API（需注意跨域與安全）。
 - 若需要，我可以幫你把 `feedback.html` 改成直接把資料 POST 到指定 API（請提供 API URL）。

祝順利！若要我直接替你把浮動按鈕 href 改成你已建立好的 Google 表單連結，請貼上該連結，我會幫你修改程式碼。
