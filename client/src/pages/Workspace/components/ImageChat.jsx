import { useState } from "react";

const ImageChat = ({ onClose }) => {
    const [prompt, setPrompt] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generateImage = async () => {
        setLoading(true);
        setError("");
        setImageUrl("");

        try {
            const res = await fetch("http://localhost:5000/openai/generateimage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Something went wrong");

            setImageUrl(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed bottom-6 right-6 z-50 w-80 bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white shadow-xl">

            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white text-sm"
            >
                ✕
            </button>
            <h3 className="text-lg font-bold mb-2">AI Image Generator</h3>
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe an image..."
                className="w-full p-2 rounded-md bg-white/10 text-white border border-white/20 mb-2"
            />
            <button
                onClick={generateImage}
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-md text-sm font-medium"
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate"}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            {imageUrl && (
                <img src={imageUrl} alt="Generated" className="mt-4 rounded-md"/>
            )}
        </div>
    );
};

export default ImageChat;
