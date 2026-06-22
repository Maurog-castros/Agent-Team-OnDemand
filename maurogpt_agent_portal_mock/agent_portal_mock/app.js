function renderAgents() {
  const grid = document.querySelector("#agentGrid");
  grid.innerHTML = AGENTS.map(agent => `
    <article class="agent-card">
      <div class="agent-head">
        <div class="agent-avatar">${agent.icon}</div>
        <span class="badge">${agent.status}</span>
      </div>
      <h3>${agent.name}</h3>
      <p>${agent.role}</p>
      <p style="margin-top: 10px; color: var(--muted-2);">${agent.workspace}</p>
      <div class="skills">
        ${agent.skills.map(skill => `<span>${skill}</span>`).join("")}
      </div>
    </article>
  `).join("");
}

function renderTimeline() {
  const timeline = document.querySelector("#timeline");
  timeline.innerHTML = DAILY_MESSAGES.map(message => `
    <div class="message">
      <div class="agent-avatar">${message.icon}</div>
      <div>
        <div>
          <span class="who">${message.agent}</span>
          <span class="when">${message.time}</span>
        </div>
        <p>${message.text}</p>
      </div>
    </div>
  `).join("");
}

function renderTasks() {
  const tasks = document.querySelector("#tasks");
  tasks.innerHTML = TASKS.map(task => `
    <div class="task">
      <strong>${task.title}</strong>
      <span>${task.owner} · ${task.state}</span>
    </div>
  `).join("");
}

function bindPrompt() {
  const input = document.querySelector("#promptInput");
  const send = document.querySelector("#sendPrompt");
  const timeline = document.querySelector("#timeline");

  send.addEventListener("click", () => {
    const value = input.value.trim();
    if (!value) return;

    const selectedAgent = document.querySelector("#agentSelect").value;
    const node = document.createElement("div");
    node.className = "message";
    node.innerHTML = `
      <div class="agent-avatar">👤</div>
      <div>
        <div>
          <span class="who">Mauro</span>
          <span class="when">ahora · ${selectedAgent}</span>
        </div>
        <p>${value}</p>
      </div>
    `;

    timeline.prepend(node);
    input.value = "";
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") send.click();
  });
}

renderAgents();
renderTimeline();
renderTasks();
bindPrompt();
