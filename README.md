# SaySomething

An interactive NLP web app for real-time toxic comment classification. Type any text and get live probability scores across six toxicity labels, powered by a fine-tuned DistilBERT model trained on the Jigsaw Toxic Comment Classification dataset.

---

## Models

The app explores four NLP models of increasing sophistication, documented on the Models page. Inference runs on the fine-tuned DistilBERT (Phase 3).

| # | Model | Type | Mean ROC-AUC |
|---|-------|------|-------------|
| 01 | TF-IDF + Logistic Regression | Classical ML | 0.9449 |
| 02 | BiLSTM + BiGRU | Deep Learning | 0.9538 |
| 03 | DistilBERT *(live inference)* | Transformer | 0.9797 |
| 04 | RoBERTa | SOTA Transformer | 0.9848 |

All models are trained on the [Jigsaw Toxic Comment Classification dataset](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge) and classify across six labels:

`toxic` · `severe_toxic` · `obscene` · `threat` · `insult` · `identity_hate`

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion
- **Backend:** Express, Node.js
- **ML Inference:** Fine-tuned DistilBERT (PyTorch) served via Python Flask
- **Routing:** React Router v7

---

## Prerequisites

- Node.js 18+
- Python 3.11+ (tested on 3.13)
- The model weights placed inside this folder:
  - `best_bert.pt` — fine-tuned DistilBERT weights
  - `tokenizer/` — tokenizer files (`tokenizer.json`, `tokenizer_config.json`)

---

## Getting Started

**1. Install Node dependencies**

```bash
npm install
```

**2. Install Python dependencies**

```bash
python3.13 -m pip install flask torch transformers
```

**3. Set up environment**

```bash
# Windows
echo ML_SERVER_URL=http://localhost:8000 > .env

# macOS / Linux
echo "ML_SERVER_URL=http://localhost:8000" > .env
```

**4. Run — two terminals**

Terminal 1 — ML inference server:
```bash
python3.13 ml_server.py
```
Wait for `Ready.` before continuing.

Terminal 2 — Web app:
```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Project Structure

```
SaySomething-master/
├── src/
│   ├── components/          # UI components (Navbar, animations, pipeline visuals)
│   ├── pages/               # Route pages (Home, Inference, Models)
│   └── utils/               # Inference client
├── my nlp models/           # Jupyter notebooks for all four model phases
│   ├── tf_idf_results.ipynb
│   ├── lstm_results.ipynb
│   ├── bert_finetuned_jigsaw.ipynb
│   └── roberta_finetuned_jigsaw.ipynb
├── ml_server.py             # Flask inference server (loads DistilBERT)
├── server.ts                # Express backend (proxies to Flask)
├── best_bert.pt             # Fine-tuned DistilBERT weights
├── tokenizer/               # Tokenizer files
└── .env                     # ML_SERVER_URL=http://localhost:8000
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the full-stack dev server |
| `npm run lint` | TypeScript type-check |

---

## Team

| Name | Student ID | Role |
|------|-----------|------|
| Fiko Alexie Van Houten | 2802520274 | Model development & debugging |
| Richtjhie Hartawan Agusta | 2802529102 | Documentation & theory |
| Kevin Sukias Kartanegara | 2802526416 | Workflow architecture & project vision |
