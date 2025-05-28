const toMs = 1000
const dayTimeSec = 24
const dayTimeMs = dayTimeSec * toMs

let currentTime = 0
let currentDay = 0
let notificationsCount = 0
let notifications = new Map()

let timerSec = document.getElementById("timerSec")
let timerDay = document.getElementById("timerDay")
let taskContainer = document.getElementById("tasks")
let taskNameInput = document.getElementById("taskName")
let taskTimeInput = document.getElementById("taskInterval")
let intervalCheckbox = document.getElementById("isInterval")
let addTaskButton = document.getElementById("createTask");

(function awake() {
    subscribeTaskCreationButton()
})();

(function start() {
    updateTime()
})();

function subscribeTaskCreationButton() {
    addTaskButton.addEventListener("click", function () {
        if (taskNameInput.value === "") return
        if (taskTimeInput.value === "" || taskTimeInput.value < 1) return
        
        let time = parseInt(taskTimeInput.value.trim())
        let name = taskNameInput.value.trim()
        let isInterval = intervalCheckbox.checked;
        let timeText;

        if (isInterval) {
            time = Math.ceil(dayTimeSec / time)
            timeText = "Notification count: " + time
        } else {
            timeText = "Notification time: " + time
        }

        notifications.set(notificationsCount.toString(), {
            name: name,
            times: time,
            isActive: true,
            isInterval: isInterval
        })
        
        // HTML
        let task = document.createElement("div")
        task.id = notificationsCount
        task.className = "task"
        let nameSpan = document.createElement("span")
        nameSpan.textContent = name
        nameSpan.className = "task-name"
        let timeSpan = document.createElement("span")
        timeSpan.textContent = timeText
        timeSpan.className = "task-time"
        let deleteButton = document.createElement("button")
        deleteButton.textContent = "delete"
        deleteButton.className = "task-delete-btn"
        let stopButton = document.createElement("button")
        stopButton.textContent = "stop"
        stopButton.className = "task-stop-btn"

        // APPEND
        taskContainer.appendChild(task)
        task.appendChild(nameSpan)
        task.appendChild(timeSpan)
        task.appendChild(stopButton)
        task.appendChild(deleteButton)

        // EVENTS
        deleteButton.addEventListener("click", function () {
            notifications.delete(this.parentElement.id)
            this.parentElement.remove()
        })

        stopButton.addEventListener("click", function () {
            let notification = notifications.get(this.parentElement.id)
            notification.isActive = false
        })

        // RESET
        taskNameInput.value = ""
        taskTimeInput.value = ""
        notificationsCount++
        intervalCheckbox.checked = false
    })
}

async function updateTime() {
    timerDay.textContent = "Days: " + currentDay

    while (currentTime < dayTimeSec) {
        timerSec.textContent = "Hours: " + currentTime
        await delay(1000)
        currentTime++

        // update notification after time update
        for (let [_, notification] of notifications) {
            if (notification.isActive === false) continue
            
            if (notification.isInterval === false) {
                if (notification.times == currentTime) {
                    console.log("H | " + notification.name)
                    alert (notification.name)
                }
            } else {
                if (currentTime % notification.times === 0) {
                    console.log("I | " + notification.name)
                    alert(notification.name)
                }
            }
        }
    }

    // RESET
    currentTime = 0
    currentDay++
    for (let [_, notification] of notifications) notification.isActive = true
    updateTime()
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}