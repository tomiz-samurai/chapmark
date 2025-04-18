# Chap.Mark 実装ロードマップ & チェックリスト v1.0

---

## 概要
- 参照ドキュメント：`docs/ChapMark要件定義.md` `docs/設計方針.md` `docs/テスト方針.md` `docs/運用ルール.md` `docs/CHANGELOG.md`
- 技術スタック：React Native / Expo・Redux Toolkit・Supabase・Edge Functions・Google Books / OpenAI / RevenueCat / Firebase Analytics
- 設計原則：SRP・型安全（TypeScript / Zod）・責務分離

---

## Phase 分割サマリー
| Phase | ゴール | 期間(想定) |
|-------|--------|-----------|
| 1. MVP | 認証・本棚・タイマー・基本投稿 | 3 ヶ月 |
| 2. AI 拡張 | 読後記事／アクションプラン生成・AI 推薦 | 2 ヶ月 |
| 3. Premium & Community | サブスク・高度統計・フォロー/いいね | 2 ヶ月 |
| 4. Long‑term | 音声入力・企業向け・外部連携拡張 | 継続 |

---

## Phase 1 – MVP

### タスク表
| # | 機能粒度 | 依存 | 見積 | レイヤ |
|---|----------|------|------|-------|
| 1 | メール認証＋プロフィール CRUD | - | SP(8)・5d | FE/BE |
| 2 | Book 検索 (Google Books) | 1 | SP(5)・3d | 共通 |
| 3 | 本棚 CRUD ＋ ステータス管理 | 2 | SP(8)・5d | FE/BE |
| 4 | 読書タイマー (BG 対応) | 3 | SP(13)・8d | FE |
| 5 | Progress API (reading_sessions) | 4 | SP(5)・3d | BE |
| 6 | 投稿(Quote/Note) 作成 | 3 | SP(8)・5d | FE/BE |
| 7 | ホーム & 本棚 UI | 1‑6 | SP(8)・5d | FE |
| 8 | 基本統計 (reading_stats view) | 5 | SP(3)・2d | BE |
| 9 | CI/CD (Expo EAS + GitHub Actions) | - | SP(3)・2d | 共通 |

### チェックリスト
- #### 着手前
  - [ ] 要件 & モック確認
  - [ ] Supabase プロジェクト & `.env` 用意
  - [ ] Edge Functions テンプレート作成
- #### 完了判定
  - [ ] 単体カバレッジ ≥ 80 %
  - [ ] Detox E2E シナリオ合格
  - [ ] 起動 < 3 秒・画面遷移 < 0.5 秒
- #### 参考チケット
  - CM‑101 認証フロー
  - CM‑118 タイマー BG 処理

### ガントチャート
| 週 | Apr W1 | Apr W2 | Apr W3 | Apr W4 | May W1 | May W2 | May W3 |
|----|--------|--------|--------|--------|--------|--------|--------|
| 認証 | ■■■□ | □ | | | | | |
| Book 検索 | | ■■□□ | | | | | |
| 本棚 | | □ | ■■■□ | | | | |
| タイマー | | | □ | ■■■■ | ■■□□ | | |
| 投稿 | | | | □ | ■■□□ | | |
| UI 統合 | | | | | □ | ■■■□ | ■ |
| CI/CD | ■ | □ | | | | | |

---

## Phase 2 – AI 拡張

### タスク表
| # | 機能粒度 | 依存 | 見積 | レイヤ |
|---|----------|------|------|-------|
| 1 | AI 読後記事生成 (OpenAI) | P1‑6 | SP(13)・8d | 共通 |
| 2 | AI アクションプラン生成 | 1 | SP(8)・5d | 共通 |
| 3 | 推薦アルゴリズム (books & posts) | P1‑8 | SP(5)・3d | BE |
| 4 | AI 設定 UI + マニュアル再生成 | 1 | SP(3)・2d | FE |
| 5 | Edge Func: ストリーク計算 | P1‑5 | SP(3)・2d | BE |
| 6 | キャッシュ戦略 (RTK Query) | 1‑4 | SP(3)・2d | FE |

### チェックリスト
- #### 着手前
  - [ ] OpenAI Key & 料金見積
  - [ ] プロンプト案レビュー
  - [ ] モデルバージョン固定
- #### 完了判定
  - [ ] AI 応答 ≤ 15 秒
  - [ ] 失敗率 < 2 %
  - [ ] テスト: プロンプト Snapshot

### ガントチャート
| 週 | Jun W1 | Jun W2 | Jun W3 | Jun W4 | Jul W1 |
|----|--------|--------|--------|--------|--------|
| 読後記事 | ■■■□ | ■■□□ | | | |
| アクション | | □ | ■■■□ | | |
| 推薦 | | ■ | ■■□□ | | |
| UI | | | □ | ■■□□ | |
| Edge Func | ■ | □ | | | |
| キャッシュ | | | | □ | ■■ |

- 参考チケット: CM‑201 AI 記事生成, CM‑219 推薦 API

---

## Phase 3 – Premium & Community

### タスク表
| # | 機能粒度 | 依存 | 見積 | レイヤ |
|---|----------|------|------|-------|
| 1 | RevenueCat サブスク導入 | P1‑9 | SP(8)・5d | FE/BE |
| 2 | 高度統計 (期間比較等) | P2‑5 | SP(5)・3d | BE |
| 3 | フォロー/いいね/ブクマ | P1‑6 | SP(13)・8d | FE/BE |
| 4 | 通知システム (FCM) | 3 | SP(8)・5d | 共通 |
| 5 | プレミアム AI 形式 | 1‑3 | SP(5)・3d | 共通 |

### チェックリスト
- #### 着手前
  - [ ] App 内課金審査要件確認
  - [ ] ソーシャルポリシー策定
- #### 完了判定
  - [ ] 課金フロー成功率 ≥ 99 %
  - [ ] 通知受信遅延 < 5 秒
  - [ ] コミュニティ機能負荷テスト OK

### ガントチャート
| 週 | Aug W1 | Aug W2 | Aug W3 | Aug W4 | Sep W1 | Sep W2 |
|----|--------|--------|--------|--------|--------|--------|
| サブスク | ■■■□ | □ | | | | |
| 統計 | | ■■□□ | | | | |
| ソーシャル | | □ | ■■■□ | ■■□□ | | |
| 通知 | | | □ | ■■□□ | ■ | |
| Premium AI | | | | □ | ■■□ | |

- 参考チケット: CM‑301 RevenueCat, CM‑328 ソーシャル API

---

## Phase 4 – Long‑term

### タスク表（抜粋）
| # | 기능粒度 | 依存 | 見積 | レイヤ |
|---|----------|------|------|-------|
| 1 | 音声入力 (Speech‑to‑Text) | 全 | SP(8)・5d | FE |
| 2 | 企業向け管理コンソール | 全 | SP(13)・8d | BE |
| 3 | Notion/Evernote 連携 | 全 | SP(5)・3d | 共通 |
| 4 | AI コーチング Bot | P2 | SP(13)・8d | 共通 |

### ガントチャート（年間イメージ）
| Q | Q1 | Q2 | Q3 | Q4 |
|---|----|----|----|----|
| 音声入力 | ■■□□ | | | |
| 企業向け | | ■■■□ | ■■□□ | |
| 外部連携 | | □ | ■■□□ | |
| AI Bot | | | □ | ■■■□ |

---

## データモデル設計

### Supabase テーブル & リレーション (要約)
```
users ─┬─< user_books >─┬─ books
       ├─< reading_sessions
       ├─< posts ─┬─< likes
       │          └─< bookmarks
       └─< follows (follower_id -> following_id)
books ─< notes
posts ─< action_plans ─< tasks
```
- `reading_stats`：`materialized view (user_id, date, minutes, pages, streak)`
- FK は `ON DELETE CASCADE`
- 主要インデックス：`user_id + status`, `book_id`, `created_at DESC`

### Edge Functions（一例）
| 名称 | トリガ | 処理 |
|------|--------|------|
| `calc_streak` | nightly CRON | reading_stats 更新・ストリーク算出 |
| `ai_generate` | RPC | 読後記事 / アクションプラン生成 |

### RBAC 設定手順
1. `anon` → SELECT `books`, INSERT 認証前 `users_pre`
2. `authenticated` → 全 CRUD 自分の row のみ (`row level policy`)
3. `service_role` → Edge Functions で使用
4. SQL:
   ```sql
   alter table posts enable row level security;
   create policy "owner" on posts
   for all using ( auth.uid() = user_id );
   ```

---

## API & フロント連携

### Endpoint 一覧（抜粋）
| Method | Path | 説明 |
|--------|------|------|
| GET | `/rpc/search_books?q=` | Google Books Proxy |
| POST | `/auth/v1/signup` | 메ール登録 |
| GET | `/rest/v1/user_books?user_id=eq.{uid}` | 本棚取得 |
| POST | `/rpc/calc_streak` | ストリーク再計算 |
| POST | `/rpc/ai_generate` | AI 生成 |

#### サンプル
```http
POST /rpc/ai_generate
{
  "type":"summary",
  "book_id": 123,
  "post_ids":[1,2]
}
--
200 OK
{
  "article":"...", "action_plan":[...]
}
```

### Redux キャッシュ戦略
- RTK Query `providesTags`=`['UserBooks','Stats']`
- ストリーミング生成時は `onCacheEntryAdded` で SSE 受信
- 正規化キー：`book_id + status`

---

## AI 機能実装アプローチ

### 推薦アルゴリズム
1. 協調フィルタ링：`user_books.status='read'`
2. Embedding (OpenAI) + Cosine 類似
3. 重み：カテゴリ相性 0.4／Embedding 0.4／人気度 0.2

### プロンプト設計指針
- System: 「あなたはキャリア読書コーチ…」
- User: 書籍要約 + 投稿/メモ JSON
- Temperature 0.7／Max 1024 tokens

### フロー
1. Client → `/rpc/ai_generate`
2. Edge Function：a) コンテンツ集約 → b) OpenAI 呼び出し
3. Stream で返却 → FE で Progress UI
4. 保存後 `posts` と `action_plans` に分割

---

## 品質確保

| レイヤ | ツール | 基準 |
|--------|-------|------|
| 単体 | Jest / React Testing Library | 80 % 覆率 |
| 統合 | Supabase Test Containers | 70 % |
| E2E | Detox (iOS/Android) | 主要フロー 100 % 合格 |
| CI | GitHub Actions PR 時 | lint+test < 5 min |
| パフォ | React DevTools Profiler | 再レンダ数 < 2/秒 |
| セキュリティ | snyk / OWASP ZAP | 高重大度 0 |

---

## 共通実装チェックリスト

### 着手前
- [ ] チケット詳細／受入基準確認
- [ ] モック & API スキーマ確定
- [ ] フィーチャーフラグ設定

### 完了判定
- [ ] テスト緑／CI pass
- [ ] 静的解析 (ESLint, type‑check) 0 error
- [ ] パフォーマンス & アクセシビリティ指標到達
- [ ] CHANGELOG 追記

---

## 全体タイムライン（ガントチャート風）

| 期 | Apr | May | Jun | Jul | Aug | Sep | Oct~ |
|----|-----|-----|-----|-----|-----|-----|------|
| Phase1 | ■■■■ | ■■■■ | | | | | |
| Phase2 | | | ■■■■ | ■ | | | |
| Phase3 | | | | | ■■■■ | ■■ | |
| Phase4 | | | | | | | ■■■■ |

--- 