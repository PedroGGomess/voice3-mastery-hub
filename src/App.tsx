import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<AuthPage />} />
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
            <Route path="/app/perfil" element={<ProtectedRoute requiredRole="student"><Perfil /></ProtectedRoute>} />
            <Route path="/app/suporte" element={<ProtectedRoute requiredRole="student"><Suporte /></ProtectedRoute>} />
            <Route path="/app/call-professor" element={<ProtectedRoute requiredRole="student"><CallProfessor /></ProtectedRoute>} />
            <Route path="/app/materiais" element={<ProtectedRoute requiredRole="student"><Materiais /></ProtectedRoute>} />
            <Route path="/app/desempenho" element={<ProtectedRoute requiredRole="student"><Desempenho /></ProtectedRoute>} />
            <Route path="/app/leaderboard" element={<ProtectedRoute requiredRole="student"><Leaderboard /></ProtectedRoute>} />
            <Route path="/app/catalogue" element={<ProtectedRoute requiredRole="student"><Catalogue /></ProtectedRoute>} />
            <Route path="/app/toolkit" element={<ProtectedRoute requiredRole="student"><Toolkit /></ProtectedRoute>} />
            <Route path="/app/toolkit/rescue-mode" element={<ProtectedRoute requiredRole="student"><RescueMode /></ProtectedRoute>} />
            <Route path="/app/toolkit/grammar" element={<ProtectedRoute requiredRole="student"><GrammarOnDemand /></ProtectedRoute>} />
            <Route path="/app/practice" element={<ProtectedRoute requiredRole="student"><Practice /></ProtectedRoute>} />
            <Route path="/app/practice/hostile-qa" element={<ProtectedRoute requiredRole="student"><HostileQA /></ProtectedRoute>} />

            {/* Company routes */}
            <Route path="/empresa" element={<ProtectedRoute requiredRole="company_admin"><CompanyDashboard /></ProtectedRoute>} />
            <Route path="/empresa/alunos" element={<ProtectedRoute requiredRole="company_admin"><Alunos /></ProtectedRoute>} />
            <Route path="/empresa/packs" element={<ProtectedRoute requiredRole="company_admin"><Packs /></ProtectedRoute>} />
            <Route path="/empresa/progresso" element={<ProtectedRoute requiredRole="company_admin"><Progresso /></ProtectedRoute>} />
            <Route path="/empresa/suporte" element={<ProtectedRoute requiredRole="company_admin"><EmpresaSuporte /></ProtectedRoute>} />
            <Route path="/empresa/definicoes" element={<ProtectedRoute requiredRole="company_admin"><Definicoes /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
