import { fetchRequest } from "../api";
import { ENDPOINT, logout } from "../common";

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

const onPlaylistItemClicked = (event) => {
  console.log(event.target);
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
    playlistItem.className = " rounded p-4 border-solid border-2 hover:cursor-pointer";
    playlistItem.id = id;
    playlistItem.setAttribute("data-type", "playlist");
    playlistItem.addEventListener("click", onPlaylistItemClicked);
    const [{ url: imageUrl }] = images;
    playlistItem.innerHTML = `
    <img src="${imageUrl}" alt="${name}" class="rounded mb-2 object-contain shadow"/>
    <h2 class="text-sm">${name}</h2>
    <h3 class="text-xs ">${description}</h3> `;


    playlistItemsSection.appendChild(playlistItem);
  }
  //   console.log(featuredPlaylist);
};


const loadPlaylists = ()=>{
  loadPlaylist(ENDPOINT.featuredPlaylist ,"featured-playlist-itmes");
  loadPlaylist(ENDPOINT.toplists ,"top-playlist-itmes");
}


document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  loadPlaylists();

  //this func handles when user click anywhere in body the logout toggle will hidden
  document.addEventListener("click", () => {
    const profileMenu = document.querySelector("#profile-menu");
    if (!profileMenu.classList.contains("hidden")) {
      profileMenu.classList.add("hidden");
    }
  });
});
