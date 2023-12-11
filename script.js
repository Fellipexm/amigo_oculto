let participants = [];

function addParticipant() {
    const inputElement = document.getElementById('participant-input');
    const participantName = inputElement.value.trim();

    if (participantName !== '') {
        participants.push(participantName);
        inputElement.value = '';
        displayParticipants();

        if (participants.length % 2 !== 0) {
            alert('Adicione mais um participante para formar pares.');
        }
    }
}

document.getElementById('participant-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addParticipant();
});

function displayParticipants() {
    const participantsList = document.getElementById('participants-list');
    participantsList.innerHTML = '';

    participants.forEach(participant => {
        const participantElement = document.createElement('div');
        participantElement.textContent = participant;
        participantElement.addEventListener('click', function() {
            removeParticipant(participant);
        });
        participantsList.appendChild(participantElement);
    });
}

function drawNames() {
    if (participants.length < 2 || participants.length % 2 !== 0) {
        alert('É necessário ter um número par de participantes para realizar o sorteio.');
        return;
    }

    const duplicateNames = getDuplicateNames(participants);
    if (duplicateNames.length > 0) {
        alert(`Clique no nome que deseja excluir: ${duplicateNames.join(', ')}`);
        return;
    }

    const shuffledParticipants = shuffleArray(participants.slice());

    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';

    participants.forEach((participant, index) => {
        const resultElement = document.createElement('div');
        resultElement.textContent = `${participant} -> ${shuffledParticipants[index]}`;
        resultContainer.appendChild(resultElement);
    });
}

function shuffleArray(array) {
    const shuffledArray = array.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    // Verifica se há coincidências após embaralhar
    const hasCoincidences = shuffledArray.some((name, index) => name === participants[index]);

    // Se houver coincidências, chama a função novamente para reembaralhar
    if (hasCoincidences) {
        return shuffleArray(array);
    }

    return shuffledArray;
}

function getDuplicateNames(array) {
    const countMap = new Map();
    const duplicates = [];

    array.forEach(name => {
        const count = countMap.get(name) || 0;
        countMap.set(name, count + 1);

        if (count === 1) {
            duplicates.push(name);
        }
    });

    return duplicates;
}

function removeParticipant(name) {
    participants = participants.filter(participant => participant !== name);
    displayParticipants();
    alert(`O participante ${name} foi removido.`);
}
