import axios from "axios";

const API_URL = 'https://conduit.productionready.io/api';

// 요청 후 받은 응답의 status를 보고 검사해야 하기 때문에 .data를 반환하지 않았음
const request = {
  async getCurrentUserInfo() {
    const userToken: string | null = localStorage.getItem('JWT');
    return await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
  },
  
  async getUserProfile(username: string) {
    return await axios.get(`${API_URL}/user/${username}`);
  },
  
  async getArticle(slug: string) {
    return await axios.get(`${API_URL}/articles/${slug}`);
  },
  
  async getArticles(param: string) {
    // 인수는 'limit=10&offset=20' 형식으로 하나만 전달해준다.
    return await axios.get(`${API_URL}/articles?${param}`);
  },
  
  async getFeedArticles(param: string) {
    const userToken: string | null = localStorage.getItem('JWT');
    return await axios.get(`${API_URL}/articles/feed/${param}`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
  },
  
  async getComments(slug: string) {
    return await axios.get(`${API_URL}/articles/${slug}/comments`);
  },
  
  async getTags() {
    return await axios.get(`${API_URL}/tags`);
  },
  
  async signin(email: string, password: string) {
    return await axios.post(`${API_URL}/users/login`, {
      user: {
        email,
        password
      }
    });
  },

  async signup(username: string, email: string, password: string) {
    return await axios.post(`${API_URL}/users`, {
      user:{
        username,
        email,
        password
      }
    });
  },
  
  async updateUserInfo(email: string, bio: string, image: string, password: string) {
    const userToken: string | null = localStorage.getItem('JWT');
    return await axios.put(`${API_URL}/user`, {
      user:{
        image,
        bio,
        email,
        password
      }
    }, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    })
  },

  async followUser(followedUsername: string) {
    const userToken: string | null = localStorage.getItem('JWT');
    return await axios.post(`${API_URL}/profiles/${followedUsername}/follow`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
  },

  async unfollowUser(unfollowedUsername: string) {
    const userToken: string | null = localStorage.getItem('JWT');
    return await axios.delete(`${API_URL}/profiles/${unfollowedUsername}/follow`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
  },

  async createAticle(title: string, description: string, body: string, tagList: string[]) {
    const userToken: string | null = localStorage.getItem('JWT');
    return axios.post('https://conduit.productionready.io/api/articles', {
      article: {
        title,
        description,
        body,
        tagList
      }
    },
    { headers: { Authorization: `Token ${userToken}` } });
  },
  
  async updateArticle(slug: string, title: string, description: string, body: string, tagList: string[]) {
    const userToken: string | null = localStorage.getItem('JWT');
    return axios.put(`${API_URL}/articles/${slug}`, {
      article: {
      title,
      description,
      body,
      tagList
      }
    },
    { headers: { Authorization: `Token ${userToken}` } });
  },

  async deleteArticle(slug: string) {
    const userToken: string | null = localStorage.getItem('JWT');
    return await axios.delete(`${API_URL}/articles/${slug}`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
  },

  async createComment(slug: string, body: string) {
    return await axios.post(`${API_URL}/articles/${slug}/comments`, {
      comment: {
        body
      }
    });
  },

  async deleteComment(slug: string, commentId: number) {
    const userToken: string | null = localStorage.getItem('JWT');
    return await axios.delete(`${API_URL}/articles/${slug}/comments/${commentId}`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
  },

  async favoriteArticle(slug: string) {
    const userToken: string | null = localStorage.getItem('JWT');
    return await axios.post(`${API_URL}/articles/${slug}/favorite`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
  },

  async unfavoriteArticle(slug: string) {
    const userToken: string | null = localStorage.getItem('JWT');
    return await axios.delete(`${API_URL}/articles/${slug}/favorite`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
  }
};

export default request;