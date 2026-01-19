import "./App.css";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Navbar from "./navbar";
import { routes } from "./routes";
import { UserProvider } from "./components/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const AppRoutes = () => useRoutes(routes);

const App = () => (
  <Router>
    <GoogleOAuthProvider clientId="663193243757-i0ts9gvj514ddrrvjj5ijtfft7ifsutt.apps.googleusercontent.com">
      <UserProvider>
        <Navbar />
        <div className="w-full min-h-screen pt-16 overflow-auto bg-gray-50">
          <AppRoutes />
        </div>
      </UserProvider>
    </GoogleOAuthProvider>
  </Router>
);

export default App;
