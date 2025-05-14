const projectCard = ({ project }) => {
    return (
        <article className="flex gap-4 p-3 border border-[#222222] rounded-md cursor-pointer">
            <img
                alt="project preview"
                className="object-cover w-40 h-24 rounded"
                src={project.imageUrl}
            />
            <div className="flex flex-col justify-between flex-1">
                <div>
                    <h2 className="text-xs font-normal text-white">{project.title}</h2>
                    <p className="text-[9px] text-[#666666] mt-1">{project.editedText}</p>
                </div>
                <div>
                    <div className={`w-7 h-7 rounded-full ${project.userBgColor} ${project.userTextColor} text-xs font-semibold flex items-center justify-center ml-auto`}>
                        {project.userInitial}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default projectCard;
