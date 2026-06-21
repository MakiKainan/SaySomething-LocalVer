import re
from pathlib import Path
import torch
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification

BASE = Path(__file__).parent
LABELS = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]

print("Loading DistilBERT...")
tokenizer = AutoTokenizer.from_pretrained(BASE / "tokenizer")
model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=6)
model.load_state_dict(torch.load(BASE / "best_bert.pt", map_location="cpu"))
model.eval()
print("Ready.")

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    text = re.sub(r"http\S+", "[URL]", request.json["text"]).strip()
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=128)
    with torch.no_grad():
        probs = torch.sigmoid(model(**inputs).logits).squeeze().tolist()
    return jsonify(dict(zip(LABELS, probs)))

if __name__ == "__main__":
    app.run(port=8000)
