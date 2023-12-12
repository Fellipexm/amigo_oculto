let participants = [];

function addParticipant() {
    const nameInput = document.getElementById('participant-input');
    const emailInput = document.getElementById('participant-email-input');

    const participantName = nameInput.value.trim();
    const participantEmail = emailInput.value.trim();

    if (participantName !== '' && participantEmail !== '' && participantEmail.toLowerCase().endsWith('@gmail.com')) {
        participants.push({ name: participantName, email: participantEmail });
        nameInput.value = '';
        emailInput.value = '';
        displayParticipants();

        if (participants.length % 2 !== 0) {
            alert('Adicione mais um participante para formar pares.');
        }
    } else {
        alert('Por favor, insira um e-mail válido do Gmail.');
    }
}

document.getElementById('participant-form').addEventListener('submit', function (event) {
    event.preventDefault();
    addParticipant();
});

document.getElementById('share-button').addEventListener('click', function () {
    const link = generateShareLink();
    displayShareLink(link);
});

function generateShareLink() {
    const uniqueIdentifier = Date.now();
    return `${window.location.origin}${window.location.pathname}?session=${uniqueIdentifier}`;
}

function displayShareLink(link) {
    const shareLinkText = document.getElementById('share-link-text');
    shareLinkText.textContent = link;
    const shareLinkElement = document.getElementById('share-link');
    shareLinkElement.style.display = 'block';
}

function promptUserForInfo(link) {
    const userName = prompt('Digite seu nome:');
    const userEmail = prompt('Digite seu e-mail do Gmail:');

    if (userName && userEmail && userEmail.toLowerCase().endsWith('@gmail.com')) {
        sendUserDataToServer(userName, userEmail);

        // Redirect to the shared link
        window.location.href = link;
    } else {
        alert('Por favor, forneça um nome e um e-mail válido do Gmail.');
    }
}

function sendUserDataToServer(userName, userEmail) {
    fetch('http://localhost:3000/share-link', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participants, user: userName, email: userEmail }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
        })
        .catch(error => console.error('Error sending data to server:', error));
}

function displayParticipants() {
    const participantsList = document.getElementById('participants-list');
    participantsList.innerHTML = '';

    participants.forEach(participant => {
        const participantElement = document.createElement('div');
        participantElement.textContent = `${participant.name} (${participant.email})`;
        participantElement.addEventListener('click', function () {
            removeParticipant(participant);
        });
        participantsList.appendChild(participantElement);
    });
}

function drawNames() {
    const emailInput = document.getElementById('participant-email-input');
    const eventTypeInput = document.getElementById('event-type-input');

    const userEmail = emailInput.value.trim();
    const eventType = eventTypeInput.value.trim();

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
        resultElement.textContent = `${participant.name} -> ${shuffledParticipants[index].name}`;
        resultContainer.appendChild(resultElement);
    });

    // sendEmails(userEmail, eventType, participants, shuffledParticipants);
}

function shuffleArray(array) {
    const shuffledArray = array.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    const hasCoincidences = shuffledArray.some((participant, index) => participant.email === participants[index].email);

    if (hasCoincidences) {
        return shuffleArray(array);
    }

    return shuffledArray;
}

function getDuplicateNames(array) {
    const countMap = new Map();
    const duplicates = [];

    array.forEach(participant => {
        const count = countMap.get(participant.email) || 0;
        countMap.set(participant.email, count + 1);

        if (count === 1) {
            duplicates.push(participant.name);
        }
    });

    return duplicates;
}

function removeParticipant(participant) {
    participants = participants.filter(p => p.email !== participant.email);
    displayParticipants();
    alert(`O participante ${participant.name} (${participant.email}) foi removido.`);
}

function sendEmails(userEmail, eventType, originalList, shuffledList) {
    console.log(`E-mail do usuário: ${userEmail}`);
    console.log(`Tipo de Evento: ${eventType}`);
    console.log('Lista Original:', originalList);
    console.log('Lista Embaralhada:', shuffledList);
    // Implemente a lógica para enviar e-mails aqui
}
