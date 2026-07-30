import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Constituents from "./pages/Constituents";
import ConstituentDetail from "./pages/ConstituentDetail";
import WebhookSettings from "./pages/WebhookSettings";
import FieldReference from "./pages/FieldReference";
import Users from "./pages/Users";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/constituents"} component={Constituents} />
      <Route path={"/constituents/:id"} component={ConstituentDetail} />
      <Route path={"/webhook-settings"} component={WebhookSettings} />
      <Route path={"/field-reference"} component={FieldReference} />
      <Route path={"/users"} component={Users} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
