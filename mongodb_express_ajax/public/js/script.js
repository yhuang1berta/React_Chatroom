/* AJAX fetch() calls 
AJAX: Techniques that allow us to asynchronously make HTTP requests without having to reload the page.
*/
const log = console.log

log('Loaded front-end javascript.')

// A function to send a GET request to the web server,
//  and then loop through them and add a list element for each student.
function getStudents() {
    // the URL for the request
    const url = '/students';

    // Since this is a GET request, simply call fetch on the URL
    fetch(url)
    .then((res) => { 
        if (res.status === 200) {
            // return a promise that resolves with the JSON body
           return res.json() 
       } else {
            alert('Could not get students')
       }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        studentsList = document.querySelector('#studentsList')
        studentsList.innerHTML = '';
        log(json)
        json.students.map((s) => {
            li = document.createElement('li')
            li.innerHTML = `Name: <strong>${s.name}</strong>, Year: <strong>${s.year}</strong>`
            studentsList.appendChild(li)
            log(s)
        })
    }).catch((error) => {
        log(error)
    })
}

// A function to send a POST request with a new student.
function addStudent() {
    // the URL for the request
    const url = '/students';

    // The data we are going to send in our request
    let data = {
        name: document.querySelector('#name').value,
        year: document.querySelector('#year').value
    }
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    // Send the request with fetch()
    fetch(request)
    .then(function(res) {

        // Handle response we get from the API.
        // Usually check the error codes to see what happened.
        const message = document.querySelector('#message')
        if (res.status === 200) {
            // If student was added successfully, tell the user.
            console.log('Added student')
            message.innerText = 'Success: Added a student.'
            message.setAttribute("style", "color: green")
           
        } else {
            // If server couldn't add the student, tell the user.
            // Here we are adding a generic message, but you could be more specific in your app.
            message.innerText = 'Could not add student'
            message.setAttribute("style", "color: red")
     
        }
        log(res)  // log the result in the console for development purposes,
                          //  users are not expected to see this.
    }).catch((error) => {
        log(error)
    })
}

