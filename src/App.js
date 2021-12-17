import './App.css';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hader from './componets/Hader';
import Tasks from './componets/Tasks';
import AddTask from './componets/AddTask';
import Footer from './componets/Footer';
import About from './componets/About';

function App() {

  const [showAddTask, setshowAddTask] = useState(false)
  const [tasks, settasks] = useState([])

  useEffect(() => {
    const gettasks = async () => {
      const taskfromserver = await fetchtask()
      settasks(taskfromserver)
    }
    gettasks()
  }, [])


  const fetchtask = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data;
  }

  const ftask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data;
  }

  //Addtask

  const addTask = async (task) => {

    const res = await
      fetch(`http://localhost:5000/tasks`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(task),
      })

    const data = await res.json()

    settasks([...tasks, data])

    /*  const id = Math.floor(Math.random() * 10000)+1
      const newtask = {id,...task}
      settasks([...tasks,newtask])*/

  }

  //delete task

  const deltask = async (id) => {

    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })

    //console.log('delete',id);
    settasks(tasks.filter((task) => task.id !== id))
  }

  //Update Task
/*
  const update = async (id) => {

    const oldtask = await ftask(id);

    const uptask = {...oldtask,}

  }*/

  //Toggle Remider

  const toremder = async (id) => {
    
    const oldtask = await ftask(id);

    //const uptask = { ...oldtask, text: "hello" }

    const uptask = {...oldtask,remider:!oldtask.remider}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(uptask),
    })


    const data = await res.json();
    //settasks(tasks.map((t) => t.id === id ? { ...t, text: !data.text } : t))
    settasks(tasks.map((t) => t.id === id ? { ...t, remider: !data.remider } : t))
    //console.log(data);
  }

  return (
    <Router>
      <div className='container'>

        <Hader title="Task Tracker"
          onAdd={() => setshowAddTask(!showAddTask)} showAdd={showAddTask} />
        <Routes>

          <Route 
          path='/'
          element = {
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
              <Tasks tasks={tasks} onDelete={deltask} onToggle={toremder}/> ) 
              : ('No Task')}

            </>
          } />

          <Route path='/about' element={<About />} />
          
          </Routes>
          <Footer />
        
      </div>

    </Router>
  )
}

export default App;
