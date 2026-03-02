import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import MeuCurso from "./pages/MeuCurso";
import Sessoes from "./pages/Sessoes";
import ChatAI from "./pages/ChatAI";
import AulasComProfessora from "./pages/AulasComProfessora";
import CompanyDashboard from "./pages/CompanyDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/app" element={<MeuCurso />} />
          <Route path="/app/sessoes" element={<Sessoes />} />
          <Route path="/app/chat" element={<ChatAI />} />
          <Route path="/app/aulas" element={<AulasComProfessora />} />
          <Route path="/empresa" element={<CompanyDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
