import Todologo from '../assets/todo-logo.png'
import calender from '../assets/calendar.png'
import profile from '../assets/account.png'
import {Link} from 'react-router-dom'



const Navbar = () => {
   
  return (
    <>
    <div className='fixed top-0 w-full bg-white/60 backdrop-blur-xs border border-violet-400 flex justify-between z-9'>
    
    <Link to="/">
     <img  src={Todologo} alt="" className="w-15 h-13 m-2 rounded-full"/>
    </Link>
       
    
   
      <ul className='flex gap-10 m-2 items-center font-medium mr-10 cursor-pointer'>
        <Link to={'/calender'}><img className='w-7' src={calender} alt="" /></Link>
        <Link to={'/profile'}><img className='w-8' src={profile} alt="" /></Link>
      </ul>
    </div>   
   
    </>
     
  )
}

export default Navbar