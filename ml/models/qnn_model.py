import torch
import torch.nn as nn
import pennylane as qml
from ml.config import DEVICE, N_QUBITS, N_CLASSES

def load_qnn_model():
    dev = qml.device("default.qubit", wires=N_QUBITS)

    @qml.qnode(dev, interface="torch")
    def qnode(inputs, weights):
        qml.AngleEmbedding(inputs, wires=range(N_QUBITS))
        qml.StronglyEntanglingLayers(weights, wires=range(N_QUBITS))
        return [qml.expval(qml.PauliZ(i)) for i in range(N_QUBITS)]

    weight_shapes = {"weights": (2, N_QUBITS, 3)}
    qlayer = qml.qnn.TorchLayer(qnode, weight_shapes)

    class HybridQNN(nn.Module):
        def __init__(self):
            super().__init__()
            self.qlayer = qlayer
            self.fc = nn.Sequential(
                nn.Linear(N_QUBITS, 32),
                nn.ReLU(),
                nn.Linear(32, N_CLASSES)
            )

        def forward(self, x):
            return self.fc(self.qlayer(x))

    model = HybridQNN().to(DEVICE)

    ckpt = torch.load(
        "ml/artifacts/qnn_torchlayer.pth",
        map_location=DEVICE
    )
    model.load_state_dict(ckpt["state_dict"])
    model.eval()
    return model
