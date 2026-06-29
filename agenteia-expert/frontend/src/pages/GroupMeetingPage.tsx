import { GroupChatView } from '../components/groupchat/GroupChatView'
import styles from './GroupMeetingPage.module.css'

export function GroupMeetingPage() {
  return (
    <div className={styles.layout}>
      <GroupChatView />
    </div>
  )
}
