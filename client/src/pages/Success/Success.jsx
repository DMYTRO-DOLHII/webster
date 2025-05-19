import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CircularProgress, Button } from "@mui/material";
import { Link } from "react-router-dom";

const SubscriptionSuccess = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("You have successfully subscribed for a new plan!");

    useEffect(() => {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
            setMessage("Missing session ID.");
            setLoading(false);
            return;
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white px-4 text-center">
            {loading ? (
                <>
                    <CircularProgress color="secondary" />
                    <p className="mt-4">Confirming your subscription...</p>
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-semibold mb-4">{message}</h1>
                    <Button variant="contained" component={Link} to="/workspace" color="secondary">
                        Go to Workspace
                    </Button>
                </>
            )}
        </div>
    );
};

export default SubscriptionSuccess;
