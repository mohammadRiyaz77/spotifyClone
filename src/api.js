import { ACCESS_TOKEN, EXPIRES_IN, logout, TOKEN_TYPE } from "./common";

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;

//check if accesToken is expires or not
const getAccessToken = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const expiresIn = localStorage.getItem(EXPIRES_IN);
  const tokenType = localStorage.getItem(TOKEN_TYPE);

  if (Date.now() < expiresIn) {
    //check if accesstoken is expire or not
    return { accessToken, tokenType };
  } else {
    //logout
    logout();
  }
};

//helper functgion which allow you to called diffrent apis
const createAPIConfig = ({ accessToken, tokenType }, method = "GET") => {
  return {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
    method,
  };
};

export const fetchRequest = async (endpoint) => {
  const url = `${BASE_API_URL}/${endpoint}`; //create url
  const result = await fetch(url, createAPIConfig(getAccessToken())); // fetch and get acces token from getacces fun

  return result.json();
};
