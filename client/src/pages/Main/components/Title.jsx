import { useEffect, useState } from 'react';

const Title = () => {
    const [text, setText] = useState('');
    const fullText = 'McOkster - Build visuals 10× faster';

    // useEffect(() => {
    //     let index = 0;
    //     const interval = setInterval(() => {
    //         console.log(text + fullText[index])
    //         setText((prev) => prev + fullText[index]);
    //         index += 1;
    //         if (index === fullText.length - 1) clearInterval(interval); // Fix end condition
    //     }, 100);

    //     return () => clearInterval(interval);
    // }, []);

    // Adjusted slicing logic to prevent skipping any characters
    return (
        // <h2 className="text-6xl font-bold text-center text-white">
        //     <span className="text-[#B52478]">{text.slice(0, 8)}</span>
        //     <span className="text-white">{text.slice(8)}</span>
        // </h2>
        <div className='typewriter'>
            <h2 className="text-6xl font-bold text-center text-white">
                <span className="text-[#9b34ba]">McOkster</span>
                <span className="text-white"> - Build visuals 10× faster</span>
            </h2>
        </div>
    );
}

export default Title;
