import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { awardPoints } from "@/lib/persistence";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";

import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import MeuCurso from "./pages/MeuCurso";
import Sessoes from "./pages/Sessoes";
import SessaoDetalhe from "./pages/SessaoDetalhe";
import ChatAI from "./pages/ChatAI";
import AulasComProfessora from "./pages/AulasComProfessora";
import Perfil from "./pages/Perfil";
import Suporte from "./pages/Suporte";
import CompanyDashboard from "./pages/CompanyDashboard";
import Alunos from "./pages/empresa/Alunos";
import Packs from "./pages/empresa/Packs";
import Progresso from "./pages/empresa/Progresso";
import EmpresaSuporte from "./pages/empresa/Suporte";
import Definicoes from "./pages/empresa/Definicoes";
import PacksPage from "./pages/PacksPage";
import CallProfessor from "./pages/CallProfessor";
import Materiais from "./pages/Materiais";
import Desempenho from "./pages/Desempenho";
import Leaderboard from "./pages/Leaderboard";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import HowItWorksPage from "./pages/HowItWorksPage";
import ForCompaniesPage from "./pages/ForCompaniesPage";
import ContactPage from "./pages/ContactPage";
import Catalogue from "./pages/Catalogue";
import Toolkit from "./pages/Toolkit";
import Practice from "./pages/Practice";
import RescueMode from "./pages/tools/RescueMode";
import GrammarOnDemand from "./pages/tools/GrammarOnDemand";
import HostileQA from "./pages/tools/HostileQA";
import ProgrammeDetail from "./pages/ProgrammeDetail";
import AIDebateClub from "./pages/tools/AIDebateClub";
import PeerDebate from "./pages/tools/PeerDebate";
import EmailToneTranslator from "./pages/tools/EmailToneTranslator";
import VocabularyAccelerator from "./pages/tools/VocabularyAccelerator";
import MeetingPrep from "./pages/tools/MeetingPrep";
import CoachPersonas from "./pages/tools/CoachPersonas";
import ShadowCoach from "./pages/tools/ShadowCoach";
import ProfessorDashboard from "./pages/professor/ProfessorDashboard";
import ProfessorStudentView from "./pages/professor/ProfessorStudentView";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DiagnosticSession from "./pages/DiagnosticSession";
import ChaptersOverview from "./pages/ChaptersOverview";
import ChapterDetail from "./pages/ChapterDetail";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function StreakTracker() {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    const today = new Date().toDateString();
    const storageKey = `v3_lastLogin_${currentUser.id}`;
    const last = localStorage.getItem(storageKey);
    if (last === today) return;

    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const yesterday = new Date(Date.now() - MS_PER_DAY).toDateString();
    const consecutive = last === yesterday;

    if (consecutive) {
      awardPoints(currentUser.id, {
        source: "streak",
        sourceId: "daily-streak",
        sourceName: "Daily streak",
        points: 50,
      });
    }
    localStorage.setItem(storageKey, today);
  }, [currentUser]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <StreakTracker />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/packs" element={<PacksPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/for-companies" element={<ForCompaniesPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Student routes */}
            <Route path="/onboarding" element={<ProtectedRoute requiredRole="student"><Onboarding /></ProtectedRoute>} />
            <Route path="/app" element={<ProtectedRoute requiredRole="student"><MeuCurso /></ProtectedRoute>} />
            <Route path="/app/sessoes" element={<ProtectedRoute requiredRole="student"><Sessoes /></ProtectedRoute>} />
            <Route path="/app/sessao/:id" element={<ProtectedRoute requiredRole="student"><SessaoDetalhe /></ProtectedRoute>} />
            <Route path="/app/chat" element={<ProtectedRoute requiredRole="student"><ChatAI /></ProtectedRoute>} />
            <Route path="/app/aulas" element={<ProtectedRoute requiredRole="student"><AulasComProfessora /></ProtectedRoute>} />
            <Route path="/app/aulas-com-professora" element={<ProtectedRoute requiredRole="student"><AulasComProfessora /></ProtectedRoute>} />
            <Route path="/app/catalogo" element={<Navigate to="/app/catalogue" replace />} />
            <Route path="/app/perfil" element={<ProtectedRoute requiredRole="student"><Perfil /></ProtectedRoute>} />
            <Route path="/app/suporte" element={<ProtectedRoute requiredRole="student"><Suporte /></ProtectedRoute>} />
            <Route path="/app/call-professor" element={<ProtectedRoute requiredRole="student"><CallProfessor /></ProtectedRoute>} />
            <Route path="/app/materiais" element={<ProtectedRoute requiredRole="student"><Materiais /></ProtectedRoute>} />
            <Route path="/app/desempenho" element={<ProtectedRoute requiredRole="student"><Desempenho /></ProtectedRoute>} />
            <Route path="/app/leaderboard" element={<ProtectedRoute requiredRole="student"><Leaderboard /></ProtectedRoute>} />
            <Route path="/app/catalogue" element={<ProtectedRoute requiredRole="student"><Catalogue /></ProtectedRoute>} />
            <Route path="/app/catalogue/:programmeId" element={<ProtectedRoute requiredRole="student"><ProgrammeDetail /></ProtectedRoute>} />
            <Route path="/app/toolkit" element={<ProtectedRoute requiredRole="student"><Toolkit /></ProtectedRoute>} />
            <Route path="/app/toolkit/rescue-mode" element={<ProtectedRoute requiredRole="student"><RescueMode /></ProtectedRoute>} />
            <Route path="/app/toolkit/grammar" element={<ProtectedRoute requiredRole="student"><GrammarOnDemand /></ProtectedRoute>} />
            <Route path="/app/toolkit/email-tone" element={<ProtectedRoute requiredRole="student"><EmailToneTranslator /></ProtectedRoute>} />
            <Route path="/app/toolkit/vocabulary" element={<ProtectedRoute requiredRole="student"><VocabularyAccelerator /></ProtectedRoute>} />
            <Route path="/app/toolkit/meeting-prep" element={<ProtectedRoute requiredRole="student"><MeetingPrep /></ProtectedRoute>} />
            <Route path="/app/toolkit/coach-personas" element={<ProtectedRoute requiredRole="student"><CoachPersonas /></ProtectedRoute>} />
            <Route path="/app/toolkit/shadow-coach" element={<ProtectedRoute requiredRole="student"><ShadowCoach /></ProtectedRoute>} />
            <Route path="/app/practice" element={<ProtectedRoute requiredRole="student"><Practice /></ProtectedRoute>} />
            <Route path="/app/practice/hostile-qa" element={<ProtectedRoute requiredRole="student"><HostileQA /></ProtectedRoute>} />
            <Route path="/app/practice/debate" element={<ProtectedRoute requiredRole="student"><AIDebateClub /></ProtectedRoute>} />
            <Route path="/app/practice/peer-debate" element={<ProtectedRoute requiredRole="student"><PeerDebate /></ProtectedRoute>} />

            {/* Company routes */}
            <Route path="/empresa" element={<ProtectedRoute requiredRole="company_admin"><CompanyDashboard /></ProtectedRoute>} />
            <Route path="/empresa/dashboard" element={<ProtectedRoute requiredRole="company_admin"><CompanyDashboard /></ProtectedRoute>} />
            <Route path="/empresa/alunos" element={<ProtectedRoute requiredRole="company_admin"><Alunos /></ProtectedRoute>} />
            <Route path="/empresa/packs" element={<ProtectedRoute requiredRole="company_admin"><Packs /></ProtectedRoute>} />
            <Route path="/empresa/progresso" element={<ProtectedRoute requiredRole="company_admin"><Progresso /></ProtectedRoute>} />
            <Route path="/empresa/suporte" element={<ProtectedRoute requiredRole="company_admin"><EmpresaSuporte /></ProtectedRoute>} />
            <Route path="/empresa/definicoes" element={<ProtectedRoute requiredRole="company_admin"><Definicoes /></ProtectedRoute>} />

            {/* Professor routes */}
            <Route path="/professor/dashboard" element={<ProtectedRoute requiredRole="professor"><ProfessorDashboard /></ProtectedRoute>} />
            <Route path="/professor/aluno/:studentId" element={<ProtectedRoute requiredRole="professor"><ProfessorStudentView /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/:section" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

            {/* Chapter / diagnostic routes (student) */}
            <Route path="/sessoes/diagnostico" element={<ProtectedRoute requiredRole="student"><DiagnosticSession /></ProtectedRoute>} />
            <Route path="/capitulos" element={<ProtectedRoute requiredRole="student"><ChaptersOverview /></ProtectedRoute>} />
            <Route path="/capitulos/:chapterId" element={<ProtectedRoute requiredRole="student"><ChapterDetail /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
