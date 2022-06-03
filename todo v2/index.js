
const listContainer = document.querySelector('[data-list]');
const newListForm = document.querySelector("[data-new-list-form]")
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListBtn = document.querySelector("[data-delete-list-button]")
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listCountElement = document.querySelector('[data-list-count]')
const listTitleElement = document.querySelector("[data-list-title]")
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.querySelector('#task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompletedTaskBtn = document.querySelector('[data-clear-complete-button]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

listContainer.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'li'){
        selectedListId = e.target.dataset.listId
        saveAndRender()
    }
})

clearCompletedTaskBtn.addEventListener('click', e => {
    const selectedList = lists.find(item => item.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(item => !item.complete)
    saveAndRender()
})

deleteListBtn.addEventListener('click', e => {
    lists = lists.filter(item => item.id !== selectedListId)
    selectedListId = null;
    saveAndRender();
})

function createList(name){
    return{ id: Date.now().toString(), name: name, tasks:[]}
}

newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if(listName == null || listName === '')return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

function createTask(name){
    return{ id: Date.now().toString(), name: name, complete: false}
}

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if(taskName == null || taskName === '')return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedTask = lists.find(item => item.id === selectedListId)
    selectedTask.tasks.push(task)
    saveAndRender()
})

tasksContainer.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'input'){
        const selectedList = lists.find(item => item.id === selectedListId)
        const selectedTask = selectedList.tasks.find(item => item.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})

function saveAndRender(){
    save()
    render()
}

function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function renderTaskCount(selectedList){
    const incompletedTaskCount = selectedList.tasks.filter(item => !item.complete).length
    const taskString = incompletedTaskCount === 1 ? 'task' : 'tasks'
    listCountElement.innerText = `${incompletedTaskCount} ${taskString} remaining`
}

function renderTasks(selectedList){
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkBox = taskElement.querySelector('input')
        checkBox.id = task.id
        checkBox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}

function render() {
    clearElement(listContainer)
    renderList()

    const selectedList = lists.find(item => item.id === selectedListId)
    if(selectedListId == null){
        listDisplayContainer.style.display = 'none'
    }else{
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}

function renderList() {
    lists.forEach(item => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = item.id
        listElement.classList.add('list-name')
        listElement.innerText = item.name
        if(item.id === selectedListId) listElement.classList.add('active-list')
        listContainer.appendChild(listElement)
    })
}

function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }

}

render()







// const ul = document.querySelector('.task-list')
// const firstLi = document.querySelector('.list-name')
// const li = document.querySelectorAll('.list-name')

// li.forEach(e => {
//     e.addEventListener('click', e => {
//         let listHeader = e.target.innerText
//         let listTitle = document.querySelector('.list-title')
//         listTitle.innerHTML = listHeader;
//         [...document.querySelectorAll('.active-list')].forEach(list => list.classList.remove('active-list'))
//         e.target.classList.add("active-list")
//     })
// })

// const listBtn = document.querySelector('#create-list')
// const listInput = document.querySelector('.list')
// listBtn.addEventListener('click', e => {
//     e.preventDefault()
//     const listInputTxt = listInput.value
//     const newLi = document.createElement('li')
//     const newLiTxt = document.createTextNode(listInputTxt)
//     newLi.appendChild(newLiTxt)
//     ul.appendChild(newLi)
// })

// const task = document.querySelectorAll('.task')
// task.addEventListener('click',(e) => {
    
// }
// )

// const taskCount = document.querySelector('.task-count')
// const count = 4
// taskCount.innerText = `${count} tasks remaining`