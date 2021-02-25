interface comment {
  author: { bio: string, following: boolean, image: string, username: string };
  body: string;
  createdAt: string;
  id: number;
  updatedAt: string;
}

export default comment;