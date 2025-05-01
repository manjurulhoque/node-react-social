import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider, PostProvider, UserProvider } from "./context";
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root") as HTMLElement).render(
    <AuthProvider>
        <SocketProvider>
            <UserProvider>
                <PostProvider>
                    <App />
                </PostProvider>
            </UserProvider>
        </SocketProvider>
    </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
