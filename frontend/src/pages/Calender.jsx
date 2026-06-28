import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { Navigate } from 'react-router-dom';


const Calender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectDate, setSelectDate] = useState(new Date());
  const [activeDay, setActiveDay] = useState("SUN")
  const [taskInput, setTaskInput] = useState("");
  const [allTasks, setAllTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("todo_tasks")
    return savedTasks ? JSON.parse(savedTasks) : [];
      
    } catch (error) {
      console.log(error);
      
      return []
    }
    
  });

  useEffect(() => {
     localStorage.setItem("todo_tasks", JSON.stringify(allTasks))
  },[allTasks])
  
  const today = new Date();

  const totalDays = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
 

  const currentMonthName = monthsArray[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const handleNextMonth = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );
    setCurrentDate(nextMonth);
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    setCurrentDate(prevMonth);
  };

  const handleTask = () => {
    if (taskInput.trim() === "") return;

    const newtTask = {
      id: Date.now(),
      text: taskInput,
      dateId: `${selectDate.getDate()}-${selectDate.getMonth()}-${selectDate.getFullYear()}`,
      completed: false,
    };

    setAllTasks([...allTasks, newtTask]);
    setTaskInput("");
  };
const isLogin = localStorage.getItem("token")

  if (!isLogin) {
    return <Navigate to="/login" replace/>
    
  }


  return (
    <div className="flex justify-center">
    <div className="container m-auto mt-25 mx-4 md:mx-auto bg-black/5 backdrop-blur-xs border border-violet-600 rounded text-violet-600 p-6 sm:p-8 w-auto max-w-lg shadow-lg relative">
      {/* header section */}

      <div className="flex justify-between px-4">
        <button onClick={handlePrevMonth}>
          <GrFormPrevious size={28} />
        </button>
        <p className="text-2xl">
          {currentMonthName} {currentYear}
        </p>
        <button onClick={handleNextMonth}>
          <MdOutlineNavigateNext size={29} />
        </button>
      </div>
      {/* weekdays grid */}
      <div className="grid grid-cols-7 pt-15 text-center text-violet-600">
        <span className="relative flex flex-col items-center" onClick={() => setActiveDay("SUN")}>SUN <div className={`h-[2px] rounded-full transition-all duration-300 mt-1 ${activeDay === 'SUN' ? 'w-8 bg-violet-500 shadow-md shadow-violet-500/50' : 'w-0 bg-transparent'}` 
          
        }></div></span>
        <span className="relative flex flex-col items-center" onClick={() => setActiveDay("MON")}>MON <div className={`h-[2px] rounded-full transition-all duration-300 mt-1 ${activeDay === 'MON' ? 'w-8 bg-violet-500 shadow-md shadow-violet-500/50' : 'w-0 bg-transparent'}`}></div></span>
        <span className="relative flex flex-col items-center" onClick={() => setActiveDay("THE")}>TUE <div className={`h-[2px] rounded-full transition-all duration-300 mt-1 ${activeDay === 'THE' ? 'w-8 bg-violet-500 shadow-md shadow-violet-500/50' : 'w-0 bg-transparent'}`}></div></span>
        <span className="relative flex flex-col items-center" onClick={() => setActiveDay("WED")}>WED <div className={`h-[2px] rounded-full transition-all duration-300 mt-1 ${activeDay === 'WED' ? 'w-8 bg-violet-500 shadow-md shadow-violet-500/50' : 'w-0 bg-transparent'}`}></div></span>
        <span className="relative flex flex-col items-center" onClick={() => setActiveDay("THU")}>THU <div className={`h-[2px] rounded-full transition-all duration-300 mt-1 ${activeDay === 'THU' ? 'w-8 bg-violet-500 shadow-md shadow-violet-500/50' : 'w-0 bg-transparent'}`}></div></span>
        <span className="relative flex flex-col items-center" onClick={() => setActiveDay("FRI")}>FRI <div className={`h-[2px] rounded-full transition-all duration-300 mt-1 ${activeDay === 'FRI' ? 'w-8 bg-violet-500 shadow-md shadow-violet-500/50' : 'w-0 bg-transparent'}`}></div></span>
        <span className="relative flex flex-col items-center" onClick={() => setActiveDay("SAT")}>SAT <div className={`h-[2px] rounded-full transition-all duration-300 mt-1 ${activeDay === 'SAT' ? 'w-8 bg-violet-500 shadow-md shadow-violet-500/50' : 'w-0 bg-transparent'}`}></div></span>
      </div>
      {/* dates grid FIXED STYLING */}
      <div className="bg-white/10  backdrop-blur-xs mt-5 p-3 rounded-xl grid grid-cols-7">
        {Array.from({ length: totalDays }, (_, index) => {
          const day = index + 1;
          const isToday =
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();

          const isSelected =
            day === selectDate.getDate() &&
            currentDate.getMonth() === selectDate.getMonth() &&
            currentDate.getFullYear() === selectDate.getFullYear();

          return (
            <div
              key={day}
              onClick={() => {
                setSelectDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day,
                  ),
                );
              }}
              className={`hover:border hover:border-violet-600 rounded-full cursor-pointer transition-all duration-200 w-12 h-12 flex items-center my-2 justify-center
                ${
                  isToday
                    ? "bg-violet-400 text-violet-600 font-bold shadow-md shadow-violet-500/50 scale-105"
                    : "hover:bg-white/10 text-black"
                }
                ${isSelected ? "border border-violet-400 bg-white/20" : ""}
                `}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* task input */}
      <div className="mt-8 flex gap-2">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder={`Task for ${selectDate.getDate()} ${monthsArray[selectDate.getMonth()]}`}
          className="bg-white/5 border border-violet-500/50 rounded p-2 flex-1 text-white text-sm outline-none placeholder:text-gray-500 focus:border-violet-400"
        />
        <button
          onClick={handleTask}
          className="bg-violet-600 hover:bg-violet-500 px-5 rounded font-bold text-sm cursor-pointer transition-all text-white"
        >
          Add
        </button>
      </div>

      {/* filter tasks list with line cut feature */}
      <div className="mt-6">
        <div className="space-y-2 overflow-hidden border border-violet-500 text-violet-400">
          {allTasks
            .filter(
              (task) =>
                task.dateId ===
                `${selectDate.getDate()}-${selectDate.getMonth()}-${selectDate.getFullYear()}`,
            )
            .map((task) => {

              return(
              <div
                key={task.id}
                className="bg-white/5 border border-white/5 p-3 rounded-lg flex items-center justify-between"
              >
                {/* line cut */}
                <div className="flex flex-row flex-1">

                
                <p
                  className={`text-sm flex-1 transition-all ${task.completed ? "line-through text-gray-500" : "text-violet-600"}`}
                >
                  {task.text}
                </p>
                <span className="text-xs mr-7 text-gray-500">{task.dateId}</span>
                </div>
               <button onClick={() => {
                const updatedTasks =  allTasks.filter((t) => t.id !== task.id)
                setAllTasks(updatedTasks)
               }}><MdDeleteForever size={25} className="text-violet-50 mx-2 hover:text-violet-500 cursor-pointer"/></button>
                {/* checkbox for line cut */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {
                    setAllTasks(
                      allTasks.map((t) =>
                        t.id === task.id
                          ? { ...t, completed: !t.completed }
                          : t,
                      ),
                    );
                  }}
                  className="w-4 h-4 accent-violet-500 cursor-pointer"
                />
              </div>
              )
            })}
        </div>
      </div>

      
    </div>
    </div>
  );
};

export default Calender;





