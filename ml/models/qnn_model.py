import torch

import torch.nn as nn

import pennylane as qml



n_qubits = 4

dev = qml.device("default.qubit", wires=n_qubits)



@qml.qnode(dev, interface="torch")

def circuit(inputs, weights):

    qml.templates.AngleEmbedding(inputs, wires=range(n_qubits))

    qml.templates.StronglyEntanglingLayers(weights, wires=range(n_qubits))

    return [qml.expval(qml.PauliZ(i)) for i in range(n_qubits)]



class QNN(nn.Module):

    def __init__(self):

        super().__init__()

        self.weights = nn.Parameter(0.01 * torch.randn(3, n_qubits, 3))



    def forward(self, x):

        outputs = []

        for i in x:

            out = circuit(i, self.weights)

            out = torch.stack(out).float()

            outputs.append(out)

        return torch.stack(outputs)



class HybridModel(nn.Module):

    def __init__(self):

        super().__init__()



        from torchvision.models import resnet50, ResNet50_Weights



        # Load pretrained ResNet50 and remove the final classification layer
        self.cnn = resnet50(weights=ResNet50_Weights.IMAGENET1K_V1)
        self.cnn.fc = nn.Identity()

        self.fc1 = nn.Linear(2048, 64)

        self.fc2 = nn.Linear(64, n_qubits)



        self.qnn = QNN()

        self.final = nn.Linear(n_qubits, 3)



    def forward(self, x):

        x = self.cnn(x)

        x = torch.relu(self.fc1(x))

        x = self.fc2(x)

        x = self.qnn(x)

        x = self.final(x)

        return x