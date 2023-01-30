import { fetchRequest } from "../api";
import { ENDPOINT, logout,  SECTIONTYPE } from "../common";

const onProfileClick = (event) => {
  event.stopPropagation();
  const profileMenu = document.querySelector("#profile-menu");
  profileMenu.classList.toggle("hidden");
  if (!profileMenu.classList.contains("hidden")) {
    profileMenu.querySelector("li#logout").addEventListener("click", logout);
  }
};

const loadUserProfile = async () => {
  //target certain elemetns
  const defaultImage = document.querySelector("#default-image");
  const profileButton = document.querySelector("#user-profile-btn");
  const displayNameElement = document.querySelector("#display-name");

  //in order to fetch this information we called some apis
  const { display_name: displayName, images } = await fetchRequest(
    ENDPOINT.userInfo
  ); //comes from spotify apis when we log in
  //   console.log(userInfo);
  if (images?.length) {
    defaultImage.classList.add("hidden");
  } else {
    defaultImage.classList.remove("hidden");
  }
  profileButton.addEventListener("click", onProfileClick);
  displayNameElement.textContent = displayName;
};

const onPlaylistItemClicked = (event,id) => {
  console.log(event.target);
  const section = {type:SECTIONTYPE.PLAYLIST , playlist:id}
  history.pushState(section,"",`playlist/${id}`);
  loadSection(section);
};

// featuredPlaylist fucntion
const loadPlaylist = async (endpoint ,elementId) => {
  const {
    playlists: { items }} = await fetchRequest(endpoint); //comes from spotify apis of featured playlist
  const playlistItemsSection = document.querySelector(
    `#${elementId}`
  );

  for (let { name, description, images, id } of items) {
    const playlistItem = document.createElement("section");
    playlistItem.className = "bg-black-secondary  rounded p-4  hover:cursor-pointer hover:bg-light-black";
    playlistItem.id = id;
    playlistItem.setAttribute("data-type", "playlist");
    playlistItem.addEventListener("click", (event)=>onPlaylistItemClicked(event,id));
    const [{ url: imageUrl }] = images;
    playlistItem.innerHTML = `
    <img src="${imageUrl}" alt="${name}" class="rounded mb-2 object-contain shadow"/>
    <h2 class="text-base font-semibold mb-4 truncate">${name}</h2>
    <h3 class="text-xs text-secondary line-clamp-2">${description}</h3> `;


    playlistItemsSection.appendChild(playlistItem);
  }
  //   console.log(featuredPlaylist);
};


const loadPlaylists = ()=>{
  loadPlaylist(ENDPOINT.featuredPlaylist ,"featured-playlist-itmes");
  loadPlaylist(ENDPOINT.toplists ,"top-playlist-itmes");
}


const fillContentForDashboard = ()=>{
const pageContent = document.querySelector("#page-content");

  const playlistMap = new Map([["featured","featured-playlist-itmes"],["top playlists","top-playlist-itmes"]]);
  let innerHTML =  "";
  for(let [type,id]of playlistMap){
    innerHTML += `
    <article class="p-4">
    <h1 class="text-2xl mb-4  font-bold capitalize">${type}</h1>
    <section
      id="${id}"
      class="featured-songs grid grid-cols-auto-fill-cards gap-4"
    >
     
    </section>
  </article>   
    `
  }
  pageContent.innerHTML = innerHTML
}

const fillContentForPlaylist =async (playlistId)=>{
  const playlist =await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
const pageContent = document.querySelector("#page-content");
pageContent.innerHTML="";
console.log(playlist);

}

const loadSection = (section)=>{
  if(section.type === SECTIONTYPE.DASHBOARD){
  // fillContentForDashboard();
  // loadPlaylists();

  }
  else if(section.type === SECTIONTYPE.PLAYLIST){
    //load the element for playlist
    fillContentForPlaylist(section.playlist);

  }
}


document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  const section = {type:SECTIONTYPE.DASHBOARD};
  history.pushState(section,"","");
  loadSection(section);

  //this func handles when user click anywhere in body the logout toggle will hidden
  document.addEventListener("click", () => {
    const profileMenu = document.querySelector("#profile-menu");
    if (!profileMenu.classList.contains("hidden")) {
      profileMenu.classList.add("hidden");
    }
  });

document.querySelector(".content").addEventListener("scroll",(event)=>{

  const {scrollTop} = event.target;
  const header = document.querySelector(".header");
  if(scrollTop >= header.offsetHeight){
    header.classList.add("sticky","top-0","bg-black-secondary");
    header.classList.remove("bg-transparent");
  }
  else{
    header.classList.remove("sticky","top-0","bg-black-secondary");
    header.classList.add("bg-transparent");
  }

})

window.addEventListener("popstate",(event)=>{
  loadSection(event.state);
})
});
