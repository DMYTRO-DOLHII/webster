import DesignCard from "./DesignCard";

const Recents = () => {
    const recentDesigns = [
        {
            imageUrl: "https://storage.googleapis.com/a1aa/image/c4282972-6674-438f-120b-40c759732269.jpg",
            title: "Template Name",
            editedText: "Edited recently",
            userInitial: "D",
            userBgColor: "bg-pink-500",
            userTextColor: "text-white"
        },
        // Add more objects here if needed
    ];

    return (
        <section aria-label="Recent templates" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(7)].map((_, i) => (
                <DesignCard key={i} design={recentDesigns[0]} />
            ))}
        </section>
    );
};

export default Recents;
