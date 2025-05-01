import React, { useEffect, useState } from "react";
import "./assets/scss/talksy.scss";
import BaseRouter from "./routes";
import { useSocket } from "./context/SocketContext";
import IncomingCallNotification from "./components/IncomingCallNotification";

interface CallReceivedData {
    signal: any;
    from: string;
    name: string;
}

const App: React.FC<any> = () => {
    const { socket } = useSocket();
    const [incomingCall, setIncomingCall] = useState<CallReceivedData | null>(
        null
    );

    useEffect(() => {
        if (!socket) {
            console.log("socket not found");
            return;
        }

        socket.on(
            "call_received",
            ({ signal, from, name }: CallReceivedData) => {
                console.log("call_received", signal, from, name);
                setIncomingCall({ signal, from, name });
            }
        );

        return () => {
            socket?.off("call_received");
        };
    }, [socket]);

    const handleAcceptCall = () => {
        if (incomingCall) {
            // navigate(`/call/${incomingCall.from}`);
            socket?.emit("call_accepted", { to: incomingCall.from });
            setIncomingCall(null);
        }
    };

    const handleRejectCall = () => {
        if (incomingCall && socket) {
            socket.emit("call_rejected", { to: incomingCall.from });
            setIncomingCall(null);
        }
    };

    return (
        <div className="App">
            {/* {incomingCall && (
                <IncomingCallNotification
                    callerName={incomingCall.name}
                    onAccept={handleAcceptCall}
                    onReject={handleRejectCall}
                />
            )} */}
            <BaseRouter />
        </div>
    );
};

export default App;
