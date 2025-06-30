document.addEventListener("DOMContentLoaded", function () {
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

  function validateUserName(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{3,16}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const url = "https://leetcode.com/graphql/";

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const graphql = JSON.stringify({
        query: `
    query getUserStats($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        username
        profile {
          ranking
          reputation
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `,
        variables: { username },
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
        redirect: "follow",
      };

      const response = await fetch(proxyUrl + url, requestOptions);
      if (!response.ok) {
        throw new Error("Unable to fetch the User details");
      }

      const fData = await response.json();
      console.log("Logging data: ", fData);

      displayUserData(fData);
    } catch (error) {
      console.log(error);
      statsContainer.innerHTML = `<p>No Data Found</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }

    statsContainer.style.display = "block";
  }

  function updateProgress(solved, total, label, circle) {
    const progressAngle = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressAngle}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(fData) {
    const totalQues = fData.data.allQuestionsCount[0].count;
    const easyQues = fData.data.allQuestionsCount[1].count;
    const mediumQues = fData.data.allQuestionsCount[2].count;
    const hardQues = fData.data.allQuestionsCount[3].count;

    const totalSolved = fData.data.matchedUser.submitStatsGlobal.totalSubmissionNum[0].count;
    const easySolved = fData.data.matchedUser.submitStatsGlobal.totalSubmissionNum[1].count;
    const mediumSolved = fData.data.matchedUser.submitStatsGlobal.totalSubmissionNum[2].count;
    const hardSolved = fData.data.matchedUser.submitStatsGlobal.totalSubmissionNum[3].count;

    updateProgress(easySolved, easyQues, easyLabel, easyProgressCircle);
    updateProgress(mediumSolved, mediumQues, mediumLabel, mediumProgressCircle);
    updateProgress(hardSolved, hardQues, hardLabel, hardProgressCircle);

    const cardsData = [
      { label: "Total Solved", value: `${totalSolved}/${totalQues}` },
      { label: "Ranking", value: fData.data.matchedUser.profile.ranking},
      { label: "AcceptanceRate", value: fData.data.matchedUser.profile.reputation },
    ];

    cardStatsContainer.innerHTML = cardsData
      .map((fData) => {
        return `
                    <div Class="card">
                    <h4>${fData.label}</h4>
                    <p>${fData.value}</p>
                    </div>
                `;
      })
      .join("");
  }
  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    if (validateUserName(username)) {
      fetchUserDetails(username);
    }
  });
});
