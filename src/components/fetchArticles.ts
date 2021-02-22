import axios from "axios";

const fetchArticles = async () => await (await axios.get('https://conduit.productionready.io/api/articles?Limit=50')).data.articles;

export default fetchArticles;
