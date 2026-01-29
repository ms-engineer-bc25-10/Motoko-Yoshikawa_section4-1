import { test, expect } from "@playwright/test";

test("一覧が表示される", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // ⭐ テーブルの「ID」が表示されていることを確認
  await expect(page.getByText("ID")).toBeVisible();

  // 行数チェック
  const rows = page.locator("table tbody tr"); // 画面上のtableのtbodyのtrを全部探してねと指示→“一覧テーブルの行（レコード）全部” を指す Locator を取得
  const rowCount = await rows.count(); // 実際にブラウザ表示されている行数を数える
  expect(rowCount).toBeGreaterThan(0); // 行数が0より大きい（＝1行以上ある）ことを期待
});

//一覧テーブルに1行以上のデータが表示されていることを保証するテスト.フロントが API にアクセスできているか, API が正しい JSON を返しているか,フロントがそのデータをレンダリングできているか
