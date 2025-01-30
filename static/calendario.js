document.addEventListener("DOMContentLoaded", () => {
    renderCalendar();
    renderCommitments();
    
    document.getElementById("prevMonth").addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
        renderCommitments();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
        renderCommitments();
    });
});

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let appointments = JSON.parse(localStorage.getItem("appointments")) || {};
let selectedDate = "";

function renderCalendar() {
    const calendarDays = document.getElementById("calendarDays");
    const currentMonthText = document.getElementById("currentMonth");

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    currentMonthText.textContent = `${firstDayOfMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`;

    calendarDays.innerHTML = '';

    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('p-3', 'text-center', 'cursor-pointer', 'rounded-lg', 'transition-all', 'duration-200', 'hover:bg-purple-700', 'hover:text-white', 'bg-gray-700', 'shadow-sm', 'text-gray-100', 'relative', 'h-16', 'flex', 'items-center', 'justify-center', 'font-semibold');
        
        const dayText = document.createElement('span');
        dayText.textContent = day;
        dayCell.appendChild(dayText);

        const dateKey = `${String(day).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`;
        
        if (appointments[dateKey]) {
            dayCell.classList.add('bg-purple-900', 'text-white');
        }

        dayCell.addEventListener('click', () => {
            selectedDate = dateKey;
            document.getElementById("selectedDateText").textContent = `Adicionar compromisso para ${selectedDate}`;
            document.getElementById("addCommitmentContainer").classList.remove("hidden");
        });

        calendarDays.appendChild(dayCell);
    }
}

function renderCommitments() {
const commitmentsListContainer = document.getElementById('commitmentsListContainer');
commitmentsListContainer.innerHTML = '';

// Verifica se não há compromissos
if (Object.keys(appointments).length === 0) {
const emptyMessage = document.createElement('li');
emptyMessage.textContent = "Nenhum compromisso ou evento cadastrado.";
emptyMessage.classList.add('p-4', 'bg-gray-700', 'rounded-lg', 'text-center', 'text-gray-400');
commitmentsListContainer.appendChild(emptyMessage);
return;
}

Object.keys(appointments).forEach(date => {
const commitments = appointments[date];
commitments.forEach((commitment, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('p-4', 'bg-gray-700', 'rounded-lg', 'shadow-sm', 'text-gray-100', 'transition', 'duration-200', 'hover:bg-blue-500', 'cursor-pointer', 'flex', 'justify-between', 'items-center');
            listItem.textContent = `${date} - ${commitment.name} às ${commitment.time} em ${commitment.location}`;
            
            const editButton = document.createElement('button');
            editButton.textContent = '✏️';
            editButton.classList.add('ml-4', 'text-yellow-400', 'hover:text-yellow-600');
            editButton.addEventListener('click', () => {
                const newName = prompt("Editar nome do compromisso", commitment.name);
                const newTime = prompt("Editar horário", commitment.time);
                const newLocation = prompt("Editar local", commitment.location);
                if (newName && newTime && newLocation) {
                    appointments[date][index] = { name: newName, time: newTime, location: newLocation };
                    localStorage.setItem("appointments", JSON.stringify(appointments));
                    renderCommitments();
                    renderCalendar();
                }
            });
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️';
            deleteButton.classList.add('ml-2', 'text-red-400', 'hover:text-red-600');
            deleteButton.addEventListener('click', () => {
                appointments[date].splice(index, 1);
                if (appointments[date].length === 0) delete appointments[date];
                localStorage.setItem("appointments", JSON.stringify(appointments));
                renderCommitments();
                renderCalendar();
            });

            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            commitmentsListContainer.appendChild(listItem);
        });
    });
}

function addCommitment() {
    const commitmentName = document.getElementById("commitmentName").value;
    const commitmentTime = document.getElementById("commitmentTime").value;
    const commitmentLocation = document.getElementById("commitmentLocation").value;

    if (commitmentName && commitmentTime && commitmentLocation) {
        const newCommitment = { name: commitmentName, time: commitmentTime, location: commitmentLocation };

        if (!appointments[selectedDate]) {
            appointments[selectedDate] = [];
        }
        appointments[selectedDate].push(newCommitment);

        localStorage.setItem("appointments", JSON.stringify(appointments));
        renderCommitments();
        renderCalendar();
        document.getElementById("commitmentName").value = '';
        document.getElementById("commitmentTime").value = '';
        document.getElementById("commitmentLocation").value = '';
        document.getElementById("addCommitmentContainer").classList.add("hidden");
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}