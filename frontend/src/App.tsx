import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import Detect from "./pages/Detect";
import Results from "./pages/Results";
import Model from "./pages/Model";
import NotFound from "./pages/NotFound";
import Contributions from "./pages/Contributions";
import Live from "./pages/Live";
import HeatMap from "./pages/HeatMap";
import Export from "./pages/Export";
import Dashboard from "./pages/Dashboard";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detect" element={<Detect />} />
              <Route path="/results" element={<Results />} />
              <Route path="/model" element={<Model />} />
              <Route path="/contributions" element={<Contributions />} />
              <Route path="/live" element={<Live />} />
              <Route path="/heatmap" element={<HeatMap />} />
              <Route path="/export" element={<Export />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
