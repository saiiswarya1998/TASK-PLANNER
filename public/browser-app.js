const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM = document.querySelector('.task-input')
const formAlertDOM = document.querySelector('.form-alert')
const welcomeAlertDOM = document.querySelector('.text-welcome')
const hiddenIdDOM = document.querySelector('.hidden-id')
const logoutDOM = document.querySelector('.logout-btn')

//get RefreshCookie
const showTask = async()=>
{
 
    loadingDOM.style.display= 'block'

    try{

      const {
        data
      } = await axios.get('/api/v1/user/taskDetails');
       
       welcomeAlertDOM.style.display = 'block'
       welcomeAlertDOM.innerHTML= `<p> Hi ${data.tokenData.username} </br> Here are your tasks... </p>`
       welcomeAlertDOM.classList.add('text-welcome');
       hiddenIdDOM.value = data.tokenData._id
       

       if (data.tasks.length < 1) {
        tasksDOM.innerHTML = '<h5 style="color:white" class="empty-list">No tasks in your list</h5>'
        loadingDOM.style.display = 'none'
        return
      }
    
      const allTasks = data.tasks
      .map((task) => {
        const { completed, _id: taskID, name } = task
        return `<div class="single-task ${completed && 'task-completed'}">
<h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
<div class="task-links">



<!-- edit link -->
<a href="edit-task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`
      })
      .join('')
     
       
    loadingDOM.style.display = 'none'
    tasksDOM.innerHTML = allTasks
    }

    catch(error)
    {
        console.log(error)
    }

   
}


showTask();


// create Task

formDOM.addEventListener('submit', async(e)=>
{
    e.preventDefault()
    const name = taskInputDOM.value
    const createdBy = hiddenIdDOM.value

    try{
        
        await axios.post('/api/v1/user/taskDetails', { name, createdBy })
        showTask()
        taskInputDOM.value = ''
        formAlertDOM.style.display = 'block'
        formAlertDOM.textContent = `success, task added`
        formAlertDOM.classList.add('text-success')
    }

    catch(error)
    {
        console.log(error)
        formAlertDOM.style.display= 'block'
        formAlertDOM.innerHTML = `<h5>There is a problem with submit`
    }

    setTimeout(()=>
    {
        formAlertDOM.style.display= 'none'
        formAlertDOM.classList.remove('text-success')
      
    }, 10000)
})


//delete task

tasksDOM.addEventListener('click', async(e)=>
{
     const createdBy = hiddenIdDOM.value;
    const el = e.target
    if(el.parentElement.classList.contains('delete-btn'))
    {
        loadingDOM.style.visibility = 'block'
        const id = el.parentElement.dataset.id
        try
        {
            await axios.delete(`/api/v1/user/${id}`)
            showTask()
        }
        catch(error)
        {
            console.log(error)
        }
    }
    loadingDOM.style.visibility = 'hidden'
})


// logout

logoutDOM.addEventListener('click', async(e)=>
{
    const createdBy = hiddenIdDOM.value
     try
        {
        await axios.delete(`/api/v1/auth/logout`)
        setTimeout(() => {
        location.href="/index.html"
  }, 1000)
        }
        catch(error)
        {
            console.log(error)
        }

})

const logout = async()=>
{
    try
        {
        await axios.delete(`/api/v1/auth/logout`)
        setTimeout(() => {
        location.href="/index.html"
  }, 1000)
        }
        catch(error)
        {
            console.log(error)
        }

}
const offtime = 7200000;

setTimeout(() => {
        logout()
  }, offtime)

