document.addEventListener("DOMContentLoaded",function(){
    const searchButton = document.getElementById("search-button");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");


    function validateUserName(username){
        if(username.trim()===""){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{3,16}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`
        try{
            searchButton.textContent="Seraching....";
            searchButton.disabled =true;
            const response = await fetch(proxyUrl+url);
            if(!response.ok){
                throw new Error("Unable to fetch the User details");
            }
            const data = await response.json();
            console.log("Logging data: ",data);

            displayUserData(data);
        }catch(error){
            console.log(error);
            statsContainer.innerHTML= `<p> No Data Found </p>`
        }finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
        statsContainer.style.display="block";
    }

    function updateProgress(solved, total, label, circle){
        const progressAngle = (solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressAngle}%`);
        label.textContent=`${solved}/${total}`;
    }

    function displayUserData(data){
        const totalQues = data.totalQuestions;
        const easyQues = data.totalEasy;
        const mediumQues = data.totalMedium;
        const hardQues = data.totalHard;

        const totalSolved = data.totalSolved;
        const easySolved = data.easySolved;
        const mediumSolved = data.mediumSolved;
        const hardSolved = data.hardSolved;

        updateProgress(easySolved, easyQues, easyLabel, easyProgressCircle);
        updateProgress(mediumSolved, mediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolved, hardQues, hardLabel, hardProgressCircle);
        

        const cardsData =[
            {label: "Total Solved",value:`${totalSolved}/${totalQues}`},
            {label: "Ranking", value: data.ranking},
            {label: "AcceptanceRate", value: data.acceptanceRate}
        ]

        cardStatsContainer.innerHTML = cardsData.map(
            data =>{
                return `
                    <div Class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>
                `
        }).join("")
    }
    searchButton.addEventListener('click', function(){
        const username = usernameInput.value;
        if(validateUserName(username)){
            fetchUserDetails(username);
        }
    })
})

