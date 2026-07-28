import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ArrowLeft, Building2 } from 'lucide-react'
import { AuthProvider } from './lib/auth'
import { ThemeProvider } from './lib/theme'
import { ToastProvider, Button } from './components/ui'
import { LoginPage, SignupPage } from './features/auth/AuthPages'
import { DashboardHome, ProtectedLayout } from './features/dashboard/Dashboard'
import { ProfilePage, SettingsPage } from './features/dashboard/AccountPages'
import { DynamicTeamPage } from './features/team/TeamPage'
import { EditPropertyPage, NewPropertyPage, PropertiesPage } from './features/properties/PropertyPages'
import { PropertyProvider } from './features/properties/property-store'
import { PropertySearchPage } from './features/search/PropertySearchPage'
import { PropertyDetailsPage } from './features/properties/PropertyDetailsPage'
import { MessagingProvider } from './features/messaging/MessagingProvider'
import { InboxPage } from './features/messaging/InboxPage'
import { NotificationProvider } from './features/notifications/NotificationProvider'
import { NotificationCenter, NotificationPreferencesPage } from './features/notifications/NotificationUI'
import { AdminRoute } from './features/admin/AdminDashboard'
import { useProperties } from './features/properties/property-store'
import { AIAssistant } from './features/ai/AIAssistant'
import { AIStudioPage } from './features/ai/AIStudioPage'
import { AIRecommendationsPage } from './features/ai/AIRecommendationsPage'

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } })

function PropertyDetailsGate() {
  const { id } = useParams()
  const { loading, error, get, fetchOne } = useProperties()
  const [fetching, setFetching] = useState(false)
  useEffect(() => { if (!loading && id && !get(id)) { setFetching(true); void fetchOne(id).finally(() => setFetching(false)) } }, [id, loading])
  if (loading || fetching) return <div className="grid min-h-[60vh] place-items-center text-sm text-slate-500">Loading property details…</div>
  if (error) return <div className="grid min-h-[60vh] place-items-center text-sm text-rose-600">{error}</div>
  return <PropertyDetailsPage />
}

function StatusPage({ code, title, message }: { code: string; title: string; message: string }) {
  const navigate = useNavigate()
  const goBack = () => { if (code === '404') navigate('/dashboard'); else navigate(-1) }
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center dark:bg-slate-950"><div><div className="mx-auto mb-7 grid size-14 place-items-center rounded-2xl bg-teal-600 text-white"><Building2/></div><p className="font-display text-8xl font-semibold tracking-tighter text-teal-700/20 dark:text-teal-300/20">{code}</p><h1 className="-mt-6 font-display text-3xl font-semibold">{title}</h1><p className="mx-auto mt-3 max-w-md text-slate-500">{message}</p><Button className="mt-7" onClick={goBack}><ArrowLeft className="size-4"/>Go back</Button></div></main>
}

function App() {
  return <QueryClientProvider client={queryClient}><ThemeProvider><ToastProvider><AuthProvider><PropertyProvider><NotificationProvider><MessagingProvider><BrowserRouter><AIAssistant/><Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/signup" element={<SignupPage/>}/>
    <Route path="/dashboard" element={<ProtectedLayout/>}>
      <Route index element={<DashboardHome/>}/>
      <Route path="search" element={<PropertySearchPage/>}/>
      <Route path="property/:id" element={<PropertyDetailsGate/>}/>
      <Route path="messages" element={<InboxPage/>}/>
      <Route path="notifications" element={<NotificationCenter/>}/>
      <Route path="notifications/preferences" element={<NotificationPreferencesPage/>}/>
      <Route path="admin" element={<AdminRoute/>}/>
      <Route path="ai-studio" element={<AIStudioPage/>}/>
      <Route path="ai-recommendations" element={<AIRecommendationsPage/>}/>
      <Route path="properties" element={<PropertiesPage/>}/>
      <Route path="properties/new" element={<NewPropertyPage/>}/>
      <Route path="properties/:id/edit" element={<EditPropertyPage/>}/>
      <Route path="profile" element={<ProfilePage/>}/>
      <Route path="team" element={<DynamicTeamPage/>}/>
      <Route path="settings" element={<SettingsPage/>}/>
    </Route>
    <Route path="/error" element={<StatusPage code="500" title="Something went sideways" message="We couldn’t complete that request. Your data is safe — please try again."/>}/>
    <Route path="*" element={<StatusPage code="404" title="This page moved on" message="The page you’re looking for doesn’t exist or may have a new address."/>}/>
  </Routes></BrowserRouter></MessagingProvider></NotificationProvider></PropertyProvider></AuthProvider></ToastProvider></ThemeProvider></QueryClientProvider>
}

export default App
