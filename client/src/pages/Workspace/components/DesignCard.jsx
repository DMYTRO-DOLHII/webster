const DesignCard = ({ design }) => {
    return (
        <article className="flex gap-4 p-3 border border-[#222222] rounded-md cursor-pointer">
            <img
                alt="Design preview"
                className="w-40 h-24 object-cover rounded"
                src={design.imageUrl}
            />
            <div className="flex flex-col justify-between flex-1">
                <div>
                    <h2 className="text-xs font-normal text-white">{design.title}</h2>
                    <p className="text-[9px] text-[#666666] mt-1">{design.editedText}</p>
                </div>
                <div>
                    <div className={`w-7 h-7 rounded-full ${design.userBgColor} ${design.userTextColor} text-xs font-semibold flex items-center justify-center ml-auto`}>
                        {design.userInitial}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default DesignCard;
