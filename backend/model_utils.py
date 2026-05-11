import os
import torch
import torch.nn as nn

from sentence_transformers import SentenceTransformer


# ---------------- DEVICE ----------------

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# ---------------- ATTENTION ----------------

class Attention(nn.Module):

    def __init__(self, hidden_dim):

        super(Attention, self).__init__()

        self.attention = nn.Linear(
            hidden_dim * 2,
            1
        )

    def forward(self, lstm_output):

        weights = torch.softmax(
            self.attention(lstm_output),
            dim=1
        )

        context = torch.sum(
            weights * lstm_output,
            dim=1
        )

        return context


# ---------------- BILSTM MODEL ----------------

class BiLSTMSummarizer(nn.Module):

    def __init__(
        self,
        input_size,
        hidden_size=128,
        dropout=0.3
    ):

        super(BiLSTMSummarizer, self).__init__()

        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            batch_first=True,
            bidirectional=True
        )

        self.attention = Attention(hidden_size)

        self.dropout = nn.Dropout(dropout)

        self.fc = nn.Linear(
            hidden_size * 2,
            1
        )

        self.sigmoid = nn.Sigmoid()

    def forward(self, x):

        lstm_out, _ = self.lstm(x)

        attention_out = self.attention(lstm_out)

        attention_out = self.dropout(attention_out)

        out = self.fc(attention_out)

        return self.sigmoid(out)


# ---------------- LOAD EMBEDDING MODEL ----------------

embedding_model = SentenceTransformer(
    'all-MiniLM-L6-v2'
)


# ---------------- LOAD TRAINED MODEL ----------------

model = BiLSTMSummarizer(
    input_size=384
).to(device)

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

model_path = os.path.join(
    BASE_DIR,
    "best_model.pth"
)

model.load_state_dict(
    torch.load(
        model_path,
        map_location=device
    )
)

model.eval()

print("Model Loaded Successfully")