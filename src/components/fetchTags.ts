import axios from "axios";

const fetchTags = async () => await (await axios.get('https://conduit.productionready.io/api/tags')).data.tags;

export default fetchTags;