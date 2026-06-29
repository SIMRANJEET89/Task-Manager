import { useEffect, useState } from "react";
import axios from "axios";
import binIcon from "../assets/bin.svg";
import editIcon from "../assets/edit.svg";
import addIcon from "../assets/add.svg";
import { toast } from "react-toastify";
import { Navigate } from 'react-router-dom';

const Home = () => { 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/update-task`,
          {
            _id: editId,
            title: title,
            description: description,
          },
        );
        if (response.data.success) {
          toast.success("Task Edit successfully");

          if (response.data.success) {
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task._id === editId ? response.data.updatedTask : task,
              ),
            );
          } else {
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task._id === editId ? response.data : task,
              ),
            );
          }

          setEditId(null);
          setTitle("");
          setDescription("");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/create-task`,
          { title, description, userId: localStorage.getItem("userId") },
          { withCredentials: true },
        );

        if (response.data.success) {
          toast.success("Task Added successfully");

          setTasks((prevTasks) => [...prevTasks, response.data.Task]);
          setTitle("");
          setDescription("");
        }
      } catch (error) {
        console.log(error.response?.data?.message || "Task Not add");
      }
    }
  };

  const handleEdit = async (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/delete-task`,
        { data: { _id: id } },
      );
      if (response.data.success) {
        toast.success("Task Deleted successfully");

        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTask = async () => {
    try {
      const saveUserId = localStorage.getItem("userId");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/get-task`,
        { params: { userId: saveUserId } },
      );

      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const toogleComplete = async (task) => {
    console.log("togglecomplt clicked");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update-task`,
        { _id: task._id, isCompleted: !task.isCompleted },
      );

      if (response.data.success) {
        
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            (t._id === task._id ? {...t, isCompleted : !t.isCompleted} : t)
          ),
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

   const isLogin = localStorage.getItem("token")

  if (!isLogin) {
    return <Navigate to="/login" replace/>
    
  }

  return (
    <>
    {
    <section className="container mx-auto mt-25 px-4 md:px-10">
      <div className="flex flex-col md:flex-row gap-8 justify-center items-start w-full">
        <div className="bg-black/10 backdrop-blur-xs border border-violet-400 p-7 w-full md:w-1/2 max-w-lg shadow-lg rounded sticky top-10">
          <p className="text-2xl font-semibold text-violet-700 text-center">
            {editId ? "Update Your Task" : "Create Your Task"}
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-cyan-50 grid gap-2 mt-4 p-3 rounded"
          >
            <div className="grid gap-1">
              <h1 className="font-medium">Title</h1>
              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                name="title"
                className="border border-violet-500 bg-violet-200 rounded w-full p-2 mt-1"
              />
            </div>

            <div className="grid gap-1">
              <h1 className="font-medium">Description</h1>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                name="discription"
                className="border border-violet-500 bg-violet-200 rounded w-full p-2 mt-1 min-h-[100px]"
              />
            </div>

            {editId ? (
              <button
                type="submit"
                className="bg-violet-300 p-2 rounded-full m-2 border border-violet-600 text-lg cursor-pointer hover:bg-purple-400 flex justify-center gap-2"
              >
                <img
                  src={editIcon}
                  className="w-7 h-7 transition-transform duration-300 hover:scale-125 text-sm md:text-lg"
                  alt=""
                />
                Edit Task
              </button>
            ) : (
              <button
                type="submit"
                className="bg-violet-300 p-2 rounded-full m-2 border border-violet-600 md:text-lg cursor-pointer hover:bg-purple-400 flex justify-center gap-2"
              >
                <img
                  src={addIcon}
                  className="w-7 h-7 transition-transform duration-300 hover:scale-125"
                  alt=""
                />
                Add Task
              </button>
            )}
          </form>
        </div>

        {/* list tasks */}
        <div className="w-full md:w-1/2 max-w-lg bg-black/10 backdrop-blur-xs border border-violet-400 p-6 rounded-lg shadow-lg h-[415px] flex flex-col overflow-scroll ">
          <h2 className="text-2xl font-bold mb-4 text-violet-700 border-b pb-4 text-center">
            Your Tasks List
          </h2>

          {tasks.length === 0 ? (
            <div className="text-center p-5 bg-violet-50 text-violet-500 rounded border border-dashed border-violet-300">
              No tasks found. Create your first task above!
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto pr-2 no-scrollbar ">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`bg-white border border-violet-200 p-4 my-3 rounded-lg shadow-sm flex justify-between items-start hover:shadow-md transition-shadow duration-200 ${task.isCompleted ? " " : " "}`}
                >
                  <div className="flex-1 pr-4 flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.isCompleted || false}
                      onChange={() => toogleComplete(task)}
                    />

                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold capitalize ${task.isCompleted ? "line-through text-gray-400" : "text-violet-700"}`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-gray-600 mt-1 text-sm whitespace-pre-wrap break-all">
                        {task.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-1 rounded hover:bg-violet-50 transition-colors"
                      title="Edit Task"
                      type="button"
                    >
                      <img
                        className="w-5 h-5 transition-transform duration-300 hover:scale-125 cursor-pointer"
                        src={editIcon}
                        alt="Edit"
                      />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete Task"
                      type="button"
                    >
                      <img
                        className="w-5 h-5 transition-transform duration-300 hover:scale-125 cursor-pointer"
                        src={binIcon}
                        alt="Delete"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>}
    </>
  );
  
};


export default Home;
