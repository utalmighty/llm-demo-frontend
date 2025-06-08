import ChatContainer from "./Chatcontiner";
import InputBar from "./InputBar";

export default function Home (){
    return (
    <div className="h-screen flex flex-col items-center justify-between relative">
        <div className="border-2 border-[#00c900] h-full border-t-0 border-b-0 w-full md:w-[50%]">
            <div><ChatContainer /></div>
            <div className="absolute bottom-0 w-full md:w-[50%]"><InputBar /></div> 
        </div>
    </div>
    );
}

// 