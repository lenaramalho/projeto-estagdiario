document.addEventListener("DOMContentLoaded", () => {
    loadTickets(); // Carrega os tickets ao carregar a página
    loadCommitments(); // Carrega compromissos ao carregar a página
    generateCalendar(); // Gera o calendário
});

// Função para salvar tickets no LocalStorage
function saveTickets(tickets) {
    localStorage.setItem("tickets", JSON.stringify(tickets));
}

// Função para carregar tickets do LocalStorage
function loadTickets() {
    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    renderTickets(tickets);
}

// Função para renderizar tickets na tabela
function renderTickets(tickets) {
    const ticketTableBody = document.getElementById("ticketTableBody");
    ticketTableBody.innerHTML = ""; // Limpa tabela

    if (tickets.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="5" class="p-4 text-center text-gray-400">Ainda não há nenhuma tarefa cadastrada.</td>
        `;
        ticketTableBody.appendChild(row);
    } else {
        tickets.forEach((ticket, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="p-2">${ticket.title}</td>
                <td class="p-2">${ticket.description}</td>
                <td class="p-2 text-center">
                    <select class="priority-dropdown text-gray-900 bg-gray-700 rounded-sm" data-index="${index}">
                        <option value="Baixa" ${ticket.priority === "Baixa" ? "selected" : ""}>Baixa</option>
                        <option value="Média" ${ticket.priority === "Média" ? "selected" : ""}>Média</option>
                        <option value="Alta" ${ticket.priority === "Alta" ? "selected" : ""}>Alta</option>
                    </select>
                </td>
                <td class="p-2 text-center">${formatDate(ticket.dueDate)}</td> <!-- Data de Prazo formatada -->
                <td class="p-2 text-center">
                    <select class="status-dropdown text-gray-900 bg-gray-300 rounded-sm" data-index="${index}">
                        <option value="Não iniciado" ${ticket.status === "Não iniciado" ? "selected" : ""}>Não iniciado</option>
                        <option value="Em andamento" ${ticket.status === "Em andamento" ? "selected" : ""}>Em andamento</option>
                        <option value="Concluído" ${ticket.status === "Concluído" ? "selected" : ""}>Concluído</option>
                    </select>
                </td>
                <td class="p-2 text-center">
                    <button class="delete-btn text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 px-3 py-1 rounded-sm" data-index="${index}">Excluir</button>
                </td>
            `;
            ticketTableBody.appendChild(row);

            // Aplica a cor de fundo para o status ao renderizar os tickets
            const statusSelect = row.querySelector(".status-dropdown");
            setStatusColor(statusSelect);  // Aplica a cor do fundo do status
        });
    }

    // Adiciona eventos para atualizar status e prioridade
    document.querySelectorAll(".priority-dropdown").forEach((select) => {
        select.addEventListener("change", updateTicket);
    });

    document.querySelectorAll(".status-dropdown").forEach((select) => {
        select.addEventListener("focus", function () {
            // Quando o dropdown for aberto, aplica fundo cinza nas opções
            const options = this.querySelectorAll("option");
            options.forEach(option => {
                option.style.backgroundColor = "#e0e0e0";  // Cor cinza para as opções do dropdown
            });
        });

        select.addEventListener("blur", function () {
            // Ao fechar o dropdown, remove a cor cinza nas opções
            const options = this.querySelectorAll("option");
            options.forEach(option => {
                option.style.backgroundColor = "";  // Reseta o fundo das opções
            });
        });

        select.addEventListener("change", function () {
            // Ao selecionar uma nova opção, muda a cor de fundo do select com base no status
            setStatusColor(this);  // Atualiza a cor do fundo do select
        });
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", deleteTicket);
    });
}

// Função para adicionar um novo ticket
document.getElementById("ticketForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que o formulário seja enviado de forma tradicional

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;
    let dueDate = document.getElementById("dueDate").value; // Captura a data de prazo

    // Ajusta a data para evitar problemas de fuso horário
    const dateParts = dueDate.split("-");  // [ano, mes, dia]
    const adjustedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    adjustedDate.setHours(0, 0, 0, 0); // Zera as horas, minutos, segundos e milissegundos

    // Converte a data ajustada de volta para string no formato ISO
    dueDate = adjustedDate.toISOString();

    const newTicket = {
        title,
        description,
        priority,  // Prioridade
        dueDate,  // Data de Prazo ajustada
        status: "Não iniciado", // Status inicial
    };

    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    tickets.push(newTicket); // Adiciona o novo ticket à lista
    saveTickets(tickets); // Salva a lista atualizada no LocalStorage
    renderTickets(tickets); // Re-renderiza os tickets na tabela

    // Limpa os campos do formulário
    document.getElementById("ticketForm").reset();
});

// Função para atualizar status ou prioridade
function updateTicket(event) {
    const index = event.target.dataset.index;
    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

    if (event.target.classList.contains("priority-dropdown")) {
        tickets[index].priority = event.target.value;
    } else if (event.target.classList.contains("status-dropdown")) {
        tickets[index].status = event.target.value;

        // Atualiza a cor de fundo do select
        const statusSelect = event.target;
        setStatusColor(statusSelect); // Atualiza a cor do select com o status
    }

    saveTickets(tickets);
    renderTickets(tickets);
}

// Função para definir a cor de fundo do select com base no status
function setStatusColor(select) {
    switch (select.value) {
        case "Não iniciado":
            select.style.backgroundColor = "#c72713"; // Vermelho
            break;
        case "Em andamento":
            select.style.backgroundColor = "#ff9e00"; // Laranja
            break;
        case "Concluído":
            select.style.backgroundColor = "#32a852"; // Verde
            break;
        default:
            select.style.backgroundColor = ""; // Nenhuma cor definida
    }
}

// Função para excluir um ticket
function deleteTicket(event) {
    const index = event.target.dataset.index;
    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

    tickets.splice(index, 1);
    saveTickets(tickets);
    renderTickets(tickets);
}

// Função para formatar a data no formato brasileiro (DD/MM/AAAA)
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses começam do 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Calendario

