import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AppShell } from './components/layout/AppShell'
import { AgentsPage } from './pages/AgentsPage'
import { ChatPage } from './pages/ChatPage'
import { DashboardPage } from './pages/DashboardPage'
import { MeetingsPage } from './pages/MeetingsPage'
import { SystemPage } from './pages/SystemPage'
import { TasksPage } from './pages/TasksPage'
import { ToolsPage } from './pages/ToolsPage'
import { WorkspacesPage } from './pages/WorkspacesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'agents', element: <AgentsPage /> },
      { path: 'workspaces', element: <WorkspacesPage /> },
      { path: 'meetings', element: <MeetingsPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'tools', element: <ToolsPage /> },
      { path: 'system', element: <SystemPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
