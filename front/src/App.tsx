import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { AnnounceProvider } from './context/AnnounceContext';
import { MainLayout } from './components/layout/MainLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Accessibility } from './pages/Accessibility';
import { Feed } from './pages/Feed';
import { Notifications } from './pages/Notifications';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { Messaging } from './pages/Messaging';
import { ProfileView } from './pages/profile/ProfileView';
import { ProfileEdit } from './pages/profile/ProfileEdit';
import { RecruiterProfileEdit } from './pages/profile/RecruiterProfileEdit';
import { Questionnaire } from './pages/questionnaire/Questionnaire';
import { RegisterWizardLayout } from './pages/register/RegisterWizardLayout';
import { Step1Account } from './pages/register/Step1Account';
import { Step2Role } from './pages/register/Step2Role';
import { Step3Skills } from './pages/register/Step3Skills';
import { Step4Video } from './pages/register/Step4Video';
import { PostRegisterPrompt } from './pages/register/PostRegisterPrompt';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminModeration } from './pages/admin/AdminModeration';
import { AdminQuestionnaire } from './pages/admin/AdminQuestionnaire';
import { AdminCompetences } from './pages/admin/AdminCompetences';
import { AdminActivitySectors } from './pages/admin/AdminActivitySectors';
import { AdminLocalisations } from './pages/admin/AdminLocalisations';
import { AdminUsers } from './pages/admin/AdminUsers';

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AnnounceProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/connexion" element={<Login />} />
              <Route path="/accessibilite" element={<Accessibility />} />

              <Route path="/inscription" element={<RegisterWizardLayout />}>
                <Route path="compte" element={<Step1Account />} />
                <Route path="profil" element={<Step2Role />} />
                <Route path="competences" element={<Step3Skills />} />
                <Route path="video" element={<Step4Video />} />
                <Route
                  path="certification-prompt"
                  element={<PostRegisterPrompt />}
                />
              </Route>

              <Route path="/flux" element={<Feed />} />
              <Route path="/profils/:id" element={<ProfileView />} />
              <Route path="/profils/:id/modifier" element={<ProfileEdit />} />
              <Route
                path="/mon-entreprise"
                element={<RecruiterProfileEdit />}
              />
              <Route path="/questionnaire" element={<Questionnaire />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/candidats" element={<RecruiterDashboard />} />
              <Route path="/messagerie" element={<Messaging />} />

              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="moderation" element={<AdminModeration />} />
                <Route path="questionnaire" element={<AdminQuestionnaire />} />
                <Route path="competences" element={<AdminCompetences />} />
                <Route path="secteurs" element={<AdminActivitySectors />} />
                <Route path="localisations" element={<AdminLocalisations />} />
                <Route path="utilisateurs" element={<AdminUsers />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AnnounceProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}
