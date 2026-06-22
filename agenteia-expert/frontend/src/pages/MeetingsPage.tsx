import { PageHeader, StatusBadge } from '../components/common/StatusBadge'
import { getAgentDisplayName } from '../data/agents'
import { MEETING_TIMELINE } from '../data/seed'
import styles from './MeetingsPage.module.css'

function meetingVariant(
  status: string,
): 'success' | 'warning' | 'neutral' | 'info' | 'danger' {
  switch (status) {
    case 'completed':
      return 'success'
    case 'in_progress':
      return 'info'
    case 'scheduled':
      return 'warning'
    case 'cancelled':
      return 'danger'
    default:
      return 'neutral'
  }
}

export function MeetingsPage() {
  return (
    <>
      <PageHeader
        title="Reuniones"
        description="Timeline de reuniones Scrum. Separado del chat conversacional."
      />

      <ol className={styles.timeline} aria-label="Timeline de reuniones">
        {MEETING_TIMELINE.map((meeting, index) => (
          <li key={meeting.id} className={styles.item}>
            <div className={styles.marker} aria-hidden="true">
              {index + 1}
            </div>
            <article className={styles.card}>
              <header className={styles.header}>
                <h2 className={styles.title}>{meeting.title}</h2>
                <div className={styles.badges}>
                  <StatusBadge label={meeting.meetingType} variant="info" />
                  <StatusBadge label={meeting.status} variant={meetingVariant(meeting.status)} />
                </div>
              </header>
              <dl className={styles.meta}>
                <div>
                  <dt>Inicio</dt>
                  <dd>
                    <time dateTime={meeting.scheduledStart}>
                      {new Intl.DateTimeFormat('es-CL', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      }).format(new Date(meeting.scheduledStart))}
                    </time>
                  </dd>
                </div>
                <div>
                  <dt>Facilitador</dt>
                  <dd>{getAgentDisplayName(meeting.facilitatorAgentId)}</dd>
                </div>
              </dl>
              <p className={styles.preview}>{meeting.summaryPreview}</p>
            </article>
          </li>
        ))}
      </ol>
    </>
  )
}
