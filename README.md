# 家計簿アプリ設計書

## 一覧画面
![一覧画面](./images/image1.png)

## 詳細画面
![詳細画面](./images/image2.png)

# 概要

家計簿アプリです。入出金一覧を取得します。該当の入出金記録から詳細画面に遷移します。新規登録が行えます。集計表にて収支差額が確認できます。

## **必要なAPI**

## **支出 / 収入（Transaction）**

### **機能**

- 一覧取得
- 詳細画面遷移
- 新規追加

| **目的** | **メソッド** | **URL** |
| --- | --- | --- |
| 一覧取得 | GET | /transactions |
| 詳細取得 | GET | /transactions/:id |
| 新規追加 | POST | /transactions |

### **1. GET /transactions**

**目的**：入出金一覧を取得する

**ステータスコード：**

- **200 OK**：一覧取得に成功
- **500 Internal Server Error**：サーバーエラー

**リクエスト**：なし

**レスポンス（例）**：

[
{
"id": "1",
"date": "2025-11-01",
"type": "収入",
"amount": 50000,
"memo": "給与"
},
{
"id": "2",
"date": "2025-11-02",
"type": "支出",
"amount": 1200,
"memo": "ランチ"
}
]

レスポンスデータ形式：

[
{
"id": string,      // 自動生成されたID
"date": string,    // YYYY-MM-DD
"type": string,    // "収入" または "支出"
"amount": number,  // 整数
"memo": string     // 任意
},
...
]

 **2. GET /transactions/:id**

**目的**：指定したIDの詳細を取得する

**ステータスコード：**

- **200 OK**：詳細取得に成功
- **404 Not Found**：指定したIDのデータが存在しない
- **500 Internal Server Error**：サーバーエラー

**リクエスト**：URL パラメータ id

**レスポンス（例）**：

{
"id": "2",
"date": "2025-11-02",
"type": "支出",
"amount": 1200,
"memo": "ランチ"
}

レスポンスデータ形式：

{
"id": string,
"date": string,
"type": string,
"amount": number,
"memo": string
}

### **3. POST /transactions**

**目的**：新しい入出金データを登録する

**ステータスコード**

- **201 Created**：新規登録成功
- **400 Bad Request**：リクエストの形式が不正（例：amountが数字ではない）
- **500 Internal Server Error**：サーバーエラー

 **リクエストヘッダー：**

Content-Type: application/json

**リクエスト（例）**：

{
"date": "2025-11-13",
"type": "支出",
"amount": 300,
"memo": "あめ"
}

**リクエストの入力ルール**

**date（必須）**：YYYY-MM-DD の形式

**type（必須）**： "収入" または "支出"

**amount（必須）**：数値（整数）

**memo（任意）**：文字列

**レスポンス（例）**：

{
"id": "48ca",
"date": "2025-11-13",
"type": "支出",
"amount": 300,
"memo": "あめ"
}

※ ID はサーバー側で自動生成される前提

**エラーレスポンス（例）：**

400 Bad Request
{
"error": "amount must be a number"
}

404 Not Found
{
"error": "transaction not found"
}

500 Internal Server Error
{
"error": "server error"
}

# **集計表（Summary）**

### **● 機能**

- 収入合計
- 支出合計
- 収支差額

| 目的 | **メソッド** | **URL** |
| --- | --- | --- |
| 収支差額取得 | GET | /summary |

### **4. GET /summary**

**目的**：収入・支出の合計を返す

**ステータスコード**

- **200 OK**：集計取得に成功
- **500 Internal Server Error**：サーバーエラー

**レスポンス（例）**：

{
"income": 50000,
"expense": 5250,
"balance": 44750
}

**レスポンスデータ形式：**

{
"income": number,   // 収入の合計
"expense": number,  // 支出の合計
"balance": number   // 収支差額
}

**計算ルール**

**income（収入合計）**：type が "収入" の amount の総和

**expense（支出合計）**：type が "支出" の amount の総和

**balance（収支差額）**：income - expense