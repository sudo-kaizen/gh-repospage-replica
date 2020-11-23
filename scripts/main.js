// show dropdown on w<767px
document.getElementById("btnHamburger").addEventListener("click", (ev) => {
  document.querySelector(".dropdown-header").classList.toggle("d-none");
});
// hide dropdown menus on clicking outside dropdown menus
document.querySelector(".overlay").addEventListener("click", (ev) => {
  document.querySelector(".dropdown-menu.profile").classList.add("d-none");
  document.querySelector(".dropdown-menu.new-items").classList.add("d-none");
  document.querySelector(".overlay").classList.add("d-none");
});
//
document
  .querySelector(".new-items-svg-wrapper")
  .addEventListener("click", (ev) => {
    document
      .querySelector(".dropdown-menu.new-items")
      .classList.remove("d-none");
    document.querySelector(".overlay").classList.remove("d-none");
  });
//
document
  .querySelector(".header-profile-icon")
  .addEventListener("click", (ev) => {
    document.querySelector(".dropdown-menu.profile").classList.remove("d-none");
    document.querySelector(".overlay").classList.remove("d-none");
  });
document
  .querySelector(".dropdown-menu.new-items")
  .addEventListener("click", (ev) => {
    document.querySelector(".dropdown-menu.new-items").classList.add("d-none");
    document.querySelector(".overlay").classList.add("d-none");
  });
document
  .querySelector(".dropdown-menu.profile")
  .addEventListener("click", (ev) => {
    document.querySelector(".dropdown-menu.profile").classList.add("d-none");
    document.querySelector(".overlay").classList.add("d-none");
  });
document.addEventListener("scroll", (ev) => {
  const fullNameEl = document.querySelector(".profile__basic .full-name");
  const tempProfile = document.querySelector(".temp-profile");
  if (fullNameEl.getBoundingClientRect().top <= 0) {
    tempProfile.classList.remove("opacity-0");
  } else {
    tempProfile.classList.add("opacity-0");
  }
});

const gqlString = `{
        user(login: "sudo-kaizen"){
          avatarUrl
          bio
          login
          name
          repositories(first:20, privacy: PUBLIC, orderBy: {field: CREATED_AT, direction: DESC}){
            totalCount,
            edges{
              node{
                description
                forkCount
                isFork
                name
                primaryLanguage{
                  color
                  name
                }
                stargazerCount
                pushedAt
                url
                viewerHasStarred
                parent{
                  url
                  nameWithOwner
                }
                repositoryTopics(first:6){
                  edges{
                    node{
                      topic{
                        name
                      }
                    }
                  }
                }
              }
            }
          }
          status{
            emojiHTML
            message
            }
          }
        }
`;

// const githubGqlUrl = "https://api.github.com/graphql";

// fetch(githubGqlUrl, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `bearer  a1cc775cda82f9e350974ceaf7fe81a4975458d5`,
//   },
//   body: JSON.stringify({ query: `${gqlString}` }),
// })
//   .then((resp) => resp.json())
//   .then(console.log)
//   .catch((err) => {
//     console.error(err);
//   });

fetch("http://localhost:3000/data")
  .then((resp) => resp.json())
  .then(populateUi)
  .catch((err) => {
    console.error(err);
  });

function populateUi({ user }) {
  // console.log(JSON.stringify(user, "", 2));
  setUsername(user);
  setFullName(user);
  setUserAvatar(user);
  setBio(user);
  setStatus(user);
  setRepoCount(user);
  createRepositoriesHTML(user);
}

function setUsername({ login }) {
  const usernameElems = [
    getElem("#dropdown-profile-username"),
    getElem("#header-link-username"),
    getElem("#temp-profile-username"),
    getElem("#profile-username"),
  ];
  usernameElems.forEach((el) => {
    el.innerHTML = login;
  });
}

function setFullName({ name: fullName }) {
  getElem("#profile-fullname").innerHTML = fullName;
}

function setUserAvatar({ avatarUrl }) {
  const profileImgElems = [
    getElem("#header-profile-avatar"),
    getElem("#header-link-avatar"),
    getElem("#temp-profile-avatar"),
    getElem("#profile-avatar"),
  ];
  profileImgElems.forEach((el) => {
    el.src = avatarUrl;
  });
}

function setBio({ bio = "" }) {
  getElem(".status-bio").innerHTML = bio;
}

function setStatus({ status: { emojiHTML = null, message = "" } }) {
  if (emojiHTML !== null) {
    // emojiHTML format:"<div><img class=\"emoji\" title=\":octocat:\" alt=\":octocat:\" src=\"https://github.githubassets.com/images/icons/emoji/octocat.png\" height=\"20\" width=\"20\" align=\"absmiddle\"></div>"
    const emojiImgUrl = emojiHTML.split('src="')[1].split('"')[0];
    const statusEmojiElems = [
      getElem(".avatar-emoji-items .img-emoji"),
      getElem(".profile__status .status-emoji-octocat"),
    ];
    statusEmojiElems.forEach((el) => {
      el.src = emojiImgUrl;
    });
  }
  const statusTextElems = [
    getElem(".avatar-emoji-items .text-emoji"),
    getElem(".profile__status .status-text"),
    getElem(".emoji-status-wrapper .emoji-status"),
  ];

  statusTextElems.forEach((el) => {
    el.innerHTML = message;
  });
}

function setRepoCount({ repositories: { totalCount } }) {
  getElem(".repo-counter").innerHTML = totalCount;
}

function createRepositoriesHTML({ repositories: { edges: reposArr } }) {
  const reposListContainer = getElem(".repos__list");
  reposListContainer.innerHTML = reposArr
    .map(({ node: repo }) => {
      const {
        description,
        forkCount,
        name,
        primaryLanguage,
        stargazerCount,
        pushedAt,
        url,
        viewerHasStarred,
        parent,
        repositoryTopics: { edges: repoTopics },
      } = repo;

      const createFork = (fork) => {
        if (fork) {
          return `
          <p class="fork-origin">
            Forked from <a href=${fork.url}>${fork.nameWithOwner}</a>
          </p>`;
        }
        return "";
      };

      const createDescription = (desc) => {
        if (desc) {
          return `<p class="repo-desc">${desc}</p>`;
        }
        return "";
      };

      const createRepoTopics = (topics) => {
        if (topics.length) {
          return `
            <ul class="repo-topics">
            ${topics
              .map(({ node }) => {
                return `<a href="#" class="repo-topic">${node.topic.name}</a>`;
              })
              .join("")}
             </ul>`;
        }
        return "";
      };

      const createRepoLanguage = (lang) => {
        if (lang) {
          return `
<li class="repo-meta__language meta">
            <span style="background-color: ${lang.color}"  class="lang-colour"></span>
            <span class="lang-name">${lang.name}</span>
 </li>
        `;
        }
        return "";
      };

      const createStarHTML = (nStars) => {
        if (nStars) {
          return `
          <li class="repo-meta__language meta">
                      <span class="star-svg"
                        ><svg
                          aria-label="star"
                          class=""
                          viewBox="0 0 16 16"
                          version="1.1"
                          width="16"
                          height="16"
                          role="img"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
                          ></path>
                        </svg>
                      </span>
                      <span class="star-count">${nStars}</span>
                    </li>`;
        }

        return "";
      };

      const createForksHTML = (nForks) => {
        if (nForks) {
          return `
                    <li class="repo-meta__forks meta">
                      <span class="fork-img">
                        <svg
                          aria-label="fork"
                          class="fork-svg"
                          viewBox="0 0 16 16"
                          version="1.1"
                          width="16"
                          height="16"
                          role="img"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          ></path>
                        </svg>
                      </span>
                      <span class="fork-count">${nForks}</span>
                    </li>
    `;
        }
        return "";
      };

      const createStarBtn = (isStarred) => {
        return `
             <div class="repo__button-wrapper">
                  <button class="btn-star-repo">
                  ${
                    isStarred
                      ? `<svg  viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path></svg>`
                      : `<svg
                      aria-label="star"
                      viewBox="0 0 16 16"
                      version="1.1"
                      width="16"
                      height="16"
                      role="img"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
                      ></path>
                    </svg>`
                  }

                    <span>${isStarred ? "Uns" : "S"}tar</span>
                  </button>
                </div> `;
      };

      const formatDate = (updatedOnStr) => {
        const getMonth = (index) => {
          switch (index) {
            case 0:
              return "Jan";
            case 1:
              return "Feb";
            case 2:
              return "Mar";
            case 3:
              return "Apr";
            case 4:
              return "May";
            case 5:
              return "Jun";
            case 7:
              return "Jul";
            case 8:
              return "Aug";
            case 9:
              return "Sep";
            case 10:
              return "Oct";
            case 11:
              return "Nov";
            default:
              return "Dec";
          }
        };
        const dateDiff = (Date.now() - Date.parse(updatedOnStr)) / 1000; // in seconds
        // console.log(dateDiff);
        // use 60 seconds as standard to determine date string
        const dateDiffTime = {
          secs: dateDiff,
          mins: dateDiff / 60,
          hours: dateDiff / 3600,
          days: dateDiff / 86400,
          months: dateDiff / (2.592 * Math.pow(10, 6)),
        };
        if (dateDiffTime.secs < 60) {
          return `Updated ${Math.floor(dateDiffTime.secs)} seconds ago`;
        } else if (dateDiffTime.mins < 60) {
          // 1 hour
          return `Updated ${Math.floor(dateDiffTime.mins)} minutes ago`;
        } else if (dateDiffTime.days < 32) {
          // 1 month
          return `Updated ${Math.floor(dateDiffTime.days)} days ago`;
        } else if (dateDiffTime.months < 12) {
          // 1 year
          return `Updated on ${new Date(updatedOnStr).getDate()} ${getMonth(
            new Date(updatedOnStr).getMonth() + 1
          )}`;
        } else {
          // > 1 year
          return `Updated on ${new Date(updatedOnStr).getDate()} ${getMonth(
            new Date(updatedOnStr).getMonth() + 1
          )} ${new Date(updatedOnStr).getFullYear()}`;
        }
        return ``;
      };

      return `
           <li class="repo">
                <div>
                  <a class="repo-name" href=${url}>${name}</a>
  ${createFork(parent)}
                  ${createDescription(description)}
                  ${createRepoTopics(repoTopics)}
                  <ul class="repo-meta">
                    ${createRepoLanguage(primaryLanguage)}
                    ${createStarHTML(stargazerCount)}
                    ${createForksHTML(forkCount)}
                    <li><span class="updated-on">${formatDate(
                      pushedAt
                    )}</span></li>
                  </ul>
                </div>
                ${createStarBtn(viewerHasStarred)}
                </div>
              </li>
    `;
    })
    .join("");
}

function getElem(selector) {
  return document.querySelector(selector);
}
