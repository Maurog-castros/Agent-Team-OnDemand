import { useId, useState } from 'react'

import { useAgentChat } from '../../context/useAgentChat'
import { AGENTS, getAgentById, type AgentId } from '../../data/agents'
import styles from './AgentConfigPanel.module.css'

export function AgentConfigPanel() {
  const { agentId, setAgentId } = useAgentChat()
  const agent = getAgentById(agentId)
  const formId = useId()
  const [model, setModel] = useState(agent.llmModel)
  const [workspace, setWorkspace] = useState(agent.workspaceLabel)
  const [policy, setPolicy] = useState(agent.policy)
  const [prompt, setPrompt] = useState(agent.systemPrompt)
  const [visible, setVisible] = useState(true)

  const promptLines = prompt.split('\n')

  if (!visible) {
    return null
  }

  return (
    <aside className={styles.panel} aria-labelledby={`${formId}-title`}>
      <header className={styles.header}>
        <h2 id={`${formId}-title`} className={styles.title}>
          Configuración del agente
        </h2>
        <button
          type="button"
          className={styles.closeBtn}
          aria-label="Cerrar panel de configuración"
          onClick={() => setVisible(false)}
        >
          ×
        </button>
      </header>

      <div className={styles.body}>
        <section className={styles.section}>
          <label className={styles.label} htmlFor={`${formId}-agent`}>
            Agente activo
          </label>
          <select
            id={`${formId}-agent`}
            className={styles.select}
            value={agentId}
            onChange={(event) => setAgentId(event.target.value as AgentId)}
          >
            {AGENTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Información</h3>
          <dl className={styles.infoGrid}>
            <div>
              <dt>Nombre</dt>
              <dd>{agent.name}</dd>
            </div>
            <div>
              <dt>ID</dt>
              <dd>
                <code>{agent.id}</code>
              </dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>
                <span className={styles.statusOnline}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  En línea
                </span>
              </dd>
            </div>
            <div>
              <dt>Proveedor</dt>
              <dd>{agent.llmProvider}</dd>
            </div>
            <div>
              <dt>Modelo</dt>
              <dd>
                <code>{agent.llmModel}</code>
              </dd>
            </div>
          </dl>
        </section>

        <section className={styles.section}>
          <label className={styles.label} htmlFor={`${formId}-model`}>
            Modelo
          </label>
          <select
            id={`${formId}-model`}
            className={styles.select}
            value={model}
            onChange={(event) => setModel(event.target.value)}
          >
            <option value="auto-hermes">auto-hermes</option>
          </select>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <label className={styles.label} htmlFor={`${formId}-prompt`}>
              Prompt
            </label>
            <div className={styles.promptLinks}>
              <button type="button" className={styles.linkBtn}>
                Editar en pantalla completa
              </button>
              <button type="button" className={styles.linkBtn}>
                Ver variables disponibles
              </button>
            </div>
          </div>
          <div className={styles.promptEditor}>
            <div className={styles.lineNumbers} aria-hidden="true">
              {promptLines.map((_, index) => (
                <span key={index}>{index + 1}</span>
              ))}
            </div>
            <textarea
              id={`${formId}-prompt`}
              className={styles.promptInput}
              value={prompt}
              rows={6}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.label} htmlFor={`${formId}-workspace`}>
            Workspace
          </label>
          <select
            id={`${formId}-workspace`}
            className={styles.select}
            value={workspace}
            onChange={(event) => setWorkspace(event.target.value)}
          >
            <option value="Producción">Producción</option>
            <option value="Desarrollo">Desarrollo</option>
            <option value="Infraestructura">Infraestructura</option>
            <option value="Backlog">Backlog</option>
          </select>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Herramientas</h3>
            <button type="button" className={styles.manageTools}>
              Gestionar herramientas ({agent.tools.length})
            </button>
          </div>
          <div className={styles.toolGrid}>
            {agent.tools.map((tool) => (
              <span key={tool} className={styles.toolTag}>
                <span className={styles.toolDot} aria-hidden="true" />
                {tool}
              </span>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.label} htmlFor={`${formId}-policy`}>
            Política
          </label>
          <select
            id={`${formId}-policy`}
            className={styles.select}
            value={policy}
            onChange={(event) => setPolicy(event.target.value)}
          >
            <option value="Estándar de Operaciones">Estándar de Operaciones</option>
            <option value="Desarrollo seguro">Desarrollo seguro</option>
            <option value="Infraestructura crítica">Infraestructura crítica</option>
            <option value="Facilitación Scrum">Facilitación Scrum</option>
          </select>
        </section>
      </div>

      <footer className={styles.footer}>
        <button type="button" className={styles.saveButton}>
          Guardar cambios
        </button>
        <p className={styles.lastSaved}>Último guardado: Hoy, 10:10 por Mauricio A.</p>
      </footer>
    </aside>
  )
}
