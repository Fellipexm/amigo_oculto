let participants = [];
let eventTypeConfirmed = false;

function confirmEventType() {
    const eventTypeInput = document.getElementById('event-type-input');
    const confirmButton = document.getElementById('confirm-button');

    if (eventTypeInput.value !== '') {
        eventTypeConfirmed = true;
        alert(`O sorteio está configurado para a ocasião: ${eventTypeInput.value}`);
        
        
        eventTypeInput.disabled = true;
        confirmButton.disabled = true;
    } else {
        alert('Por favor, selecione a ocasião antes de confirmar.');
    }
}

function addParticipant() {
    if (!eventTypeConfirmed) {
        alert('Por favor, confirme a ocasião antes de adicionar participantes.');
        return;
    }

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

document.getElementById('event-type-input').addEventListener('change', function () {
   
    eventTypeConfirmed = false;
    const confirmButton = document.getElementById('confirm-button');
    confirmButton.disabled = false; 
});

document.getElementById('confirm-button').addEventListener('click', confirmEventType);

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
    const userInfoContainer = document.getElementById('user-info-container');
    userInfoContainer.style.display = 'block';

    document.getElementById('enter-draw-button').addEventListener('click', function () {
        enterDraw(link);
    });
}

function enterDraw(link) {
    const userName = document.getElementById('user-name').value.trim();
    const userEmail = document.getElementById('user-email').value.trim();

    if (userName && userEmail && userEmail.toLowerCase().endsWith('@gmail.com')) {
        sendUserDataToServer(userName, userEmail);
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

    displayEventGreeting(eventType);

  
    participants = [];
    displayParticipants();
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

function displayEventGreeting(eventType) {
    let greeting = '';

    switch (eventType) {
        case 'amigos':
            greeting = 'Viva a amizade!';
            break;
        case 'colegas':
            greeting = 'Que seu 2024 seja repleto de muitas realizações profissionais!';
            break;
        case 'familia':
            greeting = 'Boas festas em família!';
            break;
        default:
            greeting = 'Saudações!';
    }

    const greetingContainer = document.getElementById('greeting-container');
    greetingContainer.textContent = greeting;
    greetingContainer.style.display = 'block';

    alert(greeting);
}
