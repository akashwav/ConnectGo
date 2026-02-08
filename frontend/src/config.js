// Switch this to TRUE when you deploy to Render
const IS_PRODUCTION = true;

const BASE_URL = IS_PRODUCTION 
  ? "https://connectgo.onrender.com" 
  : "http://localhost:5000";
export default BASE_URL;