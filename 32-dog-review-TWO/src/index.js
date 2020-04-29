// "id": 1,
// "likes": 4,
// "name": "Norma",
// "breed": "Italian Greyhound",
// "image": "https://3.bp.blogspot.com/-uCd3eT8_AgA/XCZ-qnZIbXI/AAAAAAAATgQ/G8t6mwyZeIwb9OtUd2tEuasstpXsJgWlQCLcBGAs/s1600/IMG_3613l.JPG",
// "comments": [
// "God's perfect idiot",
// "Everyone loves her",
// "I'm literally going to steal this dog"
// ]

// const 
const main = document.querySelector("main")
const dogForm = document.getElementById("form")
const formBtn = document.getElementById("form-btn")
dogForm.setAttribute("hidden", true)
formBtn.onclick = ()=> dogForm.toggleAttribute("hidden")
dogForm.addEventListener("submit", ()=> submitDog())
// fetches 
function fetchAllDogs(){
    fetch("http://localhost:3000/dogs")
    .then(resp => resp.json())
    .then(dogs => {dogs.forEach(dog => buildDog(dog))})
    .catch((error) => {console.error('ERROR:', error)})
}
function patchDog(dog, condition=""){
    let div = document.getElementById(`${dog.id}`)
    let p = div.querySelector("#dog-likes")

    fetch(`http://localhost:3000/dogs/${dog.id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json", Accept: "application/json"},
        body: JSON.stringify(dog)
    })
    .then(resp => resp.json())
    .then(nuDog => {
        switch (condition){
            case "comment":
                let ul = div.querySelector("#comments")
                let li = document.createElement("li")
                let last = nuDog.comments.length - 1
                li.innerText = nuDog.comments[last]
                ul.appendChild(li)
                // event.target.name.value = ""
                break 
            case "likes":
                p.innerText = `Likes: ${nuDog.likes}`
                break 
            case "super-like":
                p.innerText = `Likes: ${nuDog.likes + 10}`
                break 
            default:
                return nuDog
        }
    })
}
function postDog(dog){
    fetch("http://localhost:3000/dogs", {
        method: "POST",
        headers: {"Content-Type": "application/json", Accept: "application/json"},
        body: JSON.stringify(dog)
    })
    .then(resp => resp.json())
    .then(nuDog => buildDog(nuDog))
}
// builders 

function buildDog(dog){
    let div = document.createElement("div")
    div.id = dog.id 
    div.innerHTML = `<h2>${dog.name}</h2>
    <p>${dog.breed}</p>
    <img src='${dog.image}'></img>
    <p id='dog-likes' style='cursor: pointer'>Likes: ${dog.likes}</p>`

    let ul = document.createElement("ul")
    ul.id = "comments"
    if (dog.comments){
        dog.comments.forEach(comment => {
            let li = document.createElement("li")
            li.innerText = comment 
            ul.appendChild(li)
        })
    }
  
    let p = div.querySelector("#dog-likes")
    p.onclick = ()=>addLike(dog)
    let form = document.createElement("form")
    form.innerHTML = `<label>Add Comment:</label>
    <input placeholder='text here' type='text' name='comment'></input>
    <input type='submit'></input>`
    form.addEventListener("submit", ()=> addComment(dog))
    let btn = document.createElement("button")
    btn.innerText = "Super-Like!"
    btn.onclick = ()=> superLike(dog)

    div.append(btn, ul,form)
    main.appendChild(div)
}

// callbacks 

function addComment(dog){
    event.preventDefault()
    dog.comments.push(event.target.comment.value)
    patchDog(dog, "comment")
}

function addLike(dog){
    dog.likes += 1
    patchDog(dog, "likes")
}

function superLike(dog){
    dog.likes += 10
    patchDog(dog, "super-like")
}

function submitDog(){
    event.preventDefault()
    dog = {name: event.target.name.value, breed: event.target.breed.value, image: event.target.image.value, likes: 0, comments:[]}
    postDog(dog)
}

// call functions 
fetchAllDogs()
