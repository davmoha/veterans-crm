import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./Home";
import Constituents from "./Constituents";
import ConstituentDetail from "./ConstituentDetail";
import FieldReference from "./FieldReference";
import Users from "./Users";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/constituents" component={Constituents} />
      <Route path="/constituents/:id" component={ConstituentDetail} />
      <Route path="/field-reference" component={FieldReference} />
      <Route path="/users" component={Users} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
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
