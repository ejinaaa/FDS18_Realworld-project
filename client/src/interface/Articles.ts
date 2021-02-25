interface Article {
  author: { bio: string | null, following: boolean, image: string, username: string };
  body: string;
  createdAt: string;
  description: string;
  favorited: boolean;
  favoritesCount: number;
  slug: string;
  tagList: string[];
  title: string;
  updateAt: string;
}

export default Article;