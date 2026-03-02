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
import NotFound from "./pages/NotFound";

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

            {/* Student routes */}
            <Route path="/app" element={<ProtectedRoute requiredRole="student"><MeuCurso /></ProtectedRoute>} />
            <Route path="/app/sessoes" element={<ProtectedRoute requiredRole="student"><Sessoes /></ProtectedRoute>} />
            <Route path="/app/sessao/:id" element={<ProtectedRoute requiredRole="student"><SessaoDetalhe /></ProtectedRoute>} />
            <Route path="/app/chat" element={<ProtectedRoute requiredRole="student"><ChatAI /></ProtectedRoute>} />
            <Route path="/app/aulas" element={<ProtectedRoute requiredRole="student"><AulasComProfessora /></ProtectedRoute>} />
            <Route path="/app/perfil" element={<ProtectedRoute requiredRole="student"><Perfil /></ProtectedRoute>} />
            <Route path="/app/suporte" element={<ProtectedRoute requiredRole="student"><Suporte /></ProtectedRoute>} />

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
