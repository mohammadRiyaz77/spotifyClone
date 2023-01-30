import { fetchRequest } from "../api";
import { ENDPOINT, logout, SECTIONTYPE } from "../common";

const audio = new Audio(); //html audio element
const volume = document.querySelector("#volume");
const playButton = document.querySelector("#play");
const totalSongDuration = document.querySelector("#total-song-duration");
const songDurationCompleted = document.querySelector("#song-duration-Completed");
const songProgress = document.querySelector("#progress");
const timeline = document.querySelector("#timeline");
let progressInterval;

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

const onPlaylistItemClicked = (event, id) => {
  console.log(event.target);
  const section = { type: SECTIONTYPE.PLAYLIST, playlist: id };
  history.pushState(section, "", `playlist/${id}`);
  loadSection(section);
};

// featuredPlaylist fucntion
const loadPlaylist = async (endpoint, elementId) => {
  const {
    playlists: { items },
  } = await fetchRequest(endpoint); //comes from spotify apis of featured playlist
  const playlistItemsSection = document.querySelector(`#${elementId}`);

  for (let { name, description, images, id } of items) {
    const playlistItem = document.createElement("section");
    playlistItem.className =
      "bg-black-secondary  rounded p-4  hover:cursor-pointer hover:bg-light-black";
    playlistItem.id = id;
    playlistItem.setAttribute("data-type", "playlist");
    playlistItem.addEventListener("click", (event) =>
      onPlaylistItemClicked(event, id)
    );
    const [{ url: imageUrl }] = images;
    playlistItem.innerHTML = `
    <img src="${imageUrl}" alt="${name}" class="rounded mb-2 object-contain shadow"/>
    <h2 class="text-base font-semibold mb-4 truncate">${name}</h2>
    <h3 class="text-xs text-secondary line-clamp-2">${description}</h3> `;

    playlistItemsSection.appendChild(playlistItem);
  }
  //   console.log(featuredPlaylist);
};

const loadPlaylists = () => {
  loadPlaylist(ENDPOINT.featuredPlaylist, "featured-playlist-itmes");
  loadPlaylist(ENDPOINT.toplists, "top-playlist-itmes");
};

const fillContentForDashboard = () => {
  const pageContent = document.querySelector("#page-content");

  const playlistMap = new Map([
    ["featured", "featured-playlist-itmes"],
    ["top playlists", "top-playlist-itmes"],
  ]);
  let innerHTML = "";
  for (let [type, id] of playlistMap) {
    innerHTML += `
    <article class="p-4">
    <h1 class="text-2xl mb-4  font-bold capitalize">${type}</h1>
    <section
      id="${id}"
      class="featured-songs grid grid-cols-auto-fill-cards gap-4"
    >
     
    </section>
  </article>   
    `;
  }
  pageContent.innerHTML = innerHTML;
};

const formatTime = (duration) => {
  const min = Math.floor(duration / 60_000);
  const sec = ((duration % 6_000) / 1000).toFixed(0);
  const formatedTime =
    sec == 60 ? min + 1 + ":00" : min + ":" + (sec < 10 ? "0" : "") + sec;
  return formatedTime;
};

const onTrackSelection = (id, event) => {
  document.querySelectorAll("#tracks .track").forEach((trackItem) => {
    if (trackItem.id === id) {
      trackItem.classList.add("bg-gray", "selected");
    } else {
      trackItem.classList.remove("bg-gray", "selected");
    }
  });
};

// const timeline = document.querySelector("#")
const updateiconsForPlayMode =(id)=>{
  playButton.querySelector("span").textContent = " pause_circle";
  const playButtonInTrack = document.querySelector(`#play-track${id}`);
  playButtonInTrack.textContent = "||";
  playButtonInTrack.setAttribute("data-play","true");
}
const onAudioMetaDataLoaded = (id)=>{
  totalSongDuration.textContent= `0:${audio.duration.toFixed(0)}`;
 updateiconsForPlayMode(id);

}
const updateIconsForPauseMode = (id)=>{
  playButton.querySelector("span").textContent = " play_circle";
  const playButtonInTrack = document.querySelector(`#play-track${id}`);
  playButtonInTrack.textContent = "⬜";

}

const onNowPlayingButtonClicked = (id)=>{
  if(audio.paused){
    audio.play();
 updateiconsForPlayMode(id);

  }else{
    audio.pause();
    updateIconsForPauseMode(id);
  

  }
}

const onPlayTrack = (
  event,
  { image, artistNames, name, duration, previewUrl, id }
) => {
  const buttonWithDataPlay = document.querySelector(`[data-play="true"]`);
  if(buttonWithDataPlay?.id === `play-track${id}`){
    if(audio.pause){
      audio.play();
      updateiconsForPlayMode(id);
    }
    else{
      audio.pause();
      updateIconsForPauseMode(id);
    }
   

  }
  else{

document.querySelectorAll("[data-play]").forEach(btn=>btn.setAttribute("data-play","false"));
    console.log(image, artistNames, name, duration, previewUrl, id);
  
    const nowPlayingSongImage = document.querySelector("#now-playing-image");
    nowPlayingSongImage.src= image.url;
    const songTitle = document.querySelector("#now-playing-song");
    const artists = document.querySelector("#now-playing-artists");
  
    songTitle.textContent = name;
    artists.textContent = artistNames;
   
    
    audio.src = previewUrl;
    audio.removeEventListener("loadedmetadata",()=> onAudioMetaDataLoaded(id));
    audio.addEventListener("loadedmetadata",()=> onAudioMetaDataLoaded(id));
    playButton.addEventListener("click",()=>onNowPlayingButtonClicked(id));
    audio.play();
    clearInterval(progressInterval);
    // timeline.addEventListener("click")
   progressInterval =  setInterval(()=>{
      if(audio.paused){
        return;
      }
      songDurationCompleted.textContent = `${audio.currentTime.toFixed(0)<10 ? "0:0" + audio.currentTime.toFixed(0) : "0:" + audio.currentTime.toFixed(0) }`;
      songProgress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    },100)
    
  }

};

const loadPlaylistTracks = ({ tracks }) => {
  const trackSections = document.querySelector("#tracks");
  let trackNo = 1;
  for (let trackItem of tracks.items) {
    let {
      id,
      artists,
      name,
      album,
      duration_ms: duration,
      preview_url: previewUrl,
    } = trackItem.track;

    let track = document.createElement("section");
    track.id = id;
    track.className =
      "track p-1 items-center justify-items-start rounded-md hover:bg-light-black grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-secondary";
    let image = album.images.find((img) => img.height === 64);
    let artistNames = Array.from(artists, (artist) => artist.name).join(",");
    track.innerHTML = ` 
<p class="relative w-fullflex items-center justify-center justify-self-center"><span class ="track-no">${trackNo++}</span></p>
<section class="grid grid-cols-[auto_1fr] place-items-center gap-2">
  <img src="${image.url}" alt="${name}" class="w-10 h-10">
  <article class="flex flex-col gap-2 justify-center "> <h2 class="text-primary text-base line-clamp-1">${name}</h2>
  <p class="text-xs line-clamp-1">${artistNames}</p>
  
  </article>
</section>
<p class="text-sm">${album.name}</p>
<p class="text-sm">${formatTime(duration)}</p>
`;
    track.addEventListener("click", (event) => onTrackSelection(id, event));

    const playButton = document.createElement("button");
    playButton.id = `play-track${id}`;
    playButton.className = `play w-full absolute left-0 text-lg invisible `;
    playButton.textContent = "🔲";
    playButton.addEventListener("click", (event) =>
      onPlayTrack(event, { image, artistNames, name, duration, previewUrl, id })
    );
    track.querySelector("p").appendChild(playButton);
    trackSections.appendChild(track);
  }
};

// const loadPlaylistTracks = ({ tracks }) => {
//   const trackSections = document.querySelector("#tracks");
//   let trackNo = 1;
//   for (let trackItem of tracks.items) {
//       let { id, artists, name, album, duration_ms: duration } = trackItem.track;
//       let track = document.createElement("section");
//       track.id = id;
//       track.className = "track p-1 grid grid-cols-[50px_2fr_1fr_50px] items-center justify-items-start gap-4 rounded-md hover:bg-light-black";
//       let image = album.images.find(img => img.height === 64);

//       track.innerHTML = `
//       <p class="justify-self-center">${trackNo++}</p>
//             <section class="grid grid-cols-[auto_1fr] place-items-center gap-2">
//               <img class="h-8 w-8" src="${image.url}" alt="${name}" />
//               <article class="flex flex-col">
//                 <h2 class="text-xl text-primary">${name}</h2>
//                 <p class="text-sm">${Array.from(artists, artist => artist.name).join(", ")}</p>
//               </article>
//             </section>
//             <p>${album.name}</p>
//             <p>${formatTime(duration)}</p>
//       `;
//       trackSections.appendChild(track);
//   }

// }
const fillContentForPlaylist = async (playlistId) => {
  const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
  const coverElement = document.querySelector("#cover-content");
  const {name, description , images ,tracks }= playlist;
  coverElement.innerHTML = `
  <img src="${images[0].url}" alt="" class="object-contain h-36 w-36">
  <section>
  <h2 id="playlist-name" class="text-4xl">${name}</h2>
  <p id="playlist-details">${tracks.items.length} songs </p>
  </section>
  `
  const pageContent = document.querySelector("#page-content");
  pageContent.innerHTML = ` 
<header id="playlist-header" class="mx-8 py-4 border-secondary border-b-[0.5px] z-[2]">
<nav class="py-2">
  <ul class="grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-secondary ">
    <li class="justify-self-center">#</li>
    <li>Title</li>
    <li>Album</li>
    <li>🕒</li>
  </ul>
</nav>
</header>
<section id="tracks" class="px-8 mt-4 text-secondary">
</section>
`;
  loadPlaylistTracks(playlist);
  // console.log(playlist);
};

const onContentScroll = (event) => {
  const { scrollTop } = event.target;
  const header = document.querySelector(".header");

  if (scrollTop >= header.offsetHeight) {
    header.classList.add("sticky", "top-0", "bg-black");
    header.classList.remove("bg-transparent");
  } else {
    header.classList.remove("sticky", "top-0", "bg-black");
    header.classList.add("bg-transparent");
  }
  if (history.state.type === SECTIONTYPE.PLAYLIST) {
    const coverElement = document.querySelector("#cover-content");
    const playlistHeader = document.querySelector("#playlist-header");
    if (scrollTop >= (coverElement.offsetHeight - header.offsetHeight)) {
      playlistHeader.classList.add("sticky", "bg-black-secondary", "px-8");
      playlistHeader.classList.remove("mx-8");
      playlistHeader.style.top = `${header.offsetHeight}px`;
    } else {
      playlistHeader.classList.remove("sticky", "bg-black-secondary", "px-8");
      playlistHeader.classList.add("mx-8");
      playlistHeader.style.top = `revert`;
    }
  }
};

const loadSection = (section) => {
  if (section.type === SECTIONTYPE.DASHBOARD) {
    fillContentForDashboard();
    loadPlaylists();
  } else if (section.type === SECTIONTYPE.PLAYLIST) {
    //load the element for playlist
    fillContentForPlaylist(section.playlist);
  }
  document
    .querySelector(".content")
    .removeEventListener("scroll", onContentScroll);
  document
    .querySelector(".content")
    .addEventListener("scroll", onContentScroll);
};

document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  // const section = { type: SECTIONTYPE.DASHBOARD };
  // playlist/37i9dQZF1DWX3SoTqhs2rq
  const section = {
    type: SECTIONTYPE.PLAYLIST,
    playlist: "37i9dQZF1DWX3SoTqhs2rq",
  };
  // history.pushState(section, "", "");
  history.pushState(section, "", `/dashboard/playlist/${section.playlist}`);
  loadSection(section);

  //this func handles when user click anywhere in body the logout toggle will hidden
  document.addEventListener("click", () => {
    const profileMenu = document.querySelector("#profile-menu");
    if (!profileMenu.classList.contains("hidden")) {
      profileMenu.classList.add("hidden");
    }
  });

volume.addEventListener("change",()=>{
  audio.volume = volume.value/ 100;
});

timeline.addEventListener("click",(e)=>{
  const timelineWidth = window.getComputedStyle(timeline).width;
  const timeToSeek= (e.offsetX / parseInt(timelineWidth)) * audio.duration;
  audio.currentTime = timeToSeek;
  songProgress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;

},false);

  window.addEventListener("popstate", (event) => {
    loadSection(event.state);
  });
});
