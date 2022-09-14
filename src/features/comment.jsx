import { createSlice, current } from "@reduxjs/toolkit";

import { useLocalStorage } from "../hooks/useLocalStorage";

let initialState = {};
const [getStorage, setStorage] = useLocalStorage();

if (!getStorage("data")) {
  const data = {
    currentUser: {
      image: {
        png: "/images/avatars/image-juliusomo.png",
        webp: "/images/avatars/image-juliusomo.webp",
      },
      username: "juliusomo",
    },
    comments: [
      {
        id: 1,
        content:
          "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
        createdAt: "1 month ago",
        score: 12,
        user: {
          image: {
            png: "/images/avatars/image-amyrobson.png",
            webp: "/images/avatars/image-amyrobson.webp",
          },
          username: "amyrobson",
        },
        replies: [],
      },
      {
        id: 2,
        content:
          "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
        createdAt: "2 weeks ago",
        score: 5,
        user: {
          image: {
            png: "/images/avatars/image-maxblagun.png",
            webp: "/images/avatars/image-maxblagun.webp",
          },
          username: "maxblagun",
        },
        replies: [
          {
            id: 1,
            content:
              "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
            createdAt: "1 week ago",
            score: 4,
            replyingTo: "maxblagun",
            user: {
              image: {
                png: "/images/avatars/image-ramsesmiron.png",
                webp: "/images/avatars/image-ramsesmiron.webp",
              },
              username: "ramsesmiron",
            },
          },
          {
            id: 2,
            content:
              "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
            createdAt: "2 days ago",
            score: 2,
            replyingTo: "ramsesmiron",
            user: {
              image: {
                png: "/images/avatars/image-juliusomo.png",
                webp: "/images/avatars/image-juliusomo.webp",
              },
              username: "juliusomo",
            },
          },
        ],
      },
    ],
  };
  setStorage(data);
  initialState = data;
} else {
  initialState = getStorage("data");
}

export const commentData = createSlice({
  name: "commentData",
  initialState,
  reducers: {
    addComment: (state, action) => {
      const data = {
        id: state.comments.length,
        content: action.payload,
        createdAt: Date.now(),
        score: 0,
        user: state.currentUser,
        replies: [],
      };
      state.comments.push(data);
      setStorage(state);
    },
    removeComment: (state, action) => {
      state.comments.splice(action.payload, 1);
      setStorage(state);
    },
    updateComment: (state, action) => {
      const { updatedComment, outId } = action.payload;
      state.comments[outId].content = updatedComment;
      setStorage(state);
    },
    replyRemove: (state, action) => {
      const { inId, outId } = action.payload;
      state.comments[outId].replies.splice(inId, 1);
      setStorage(state);
    },
    replyUpdate: (state, action) => {
      const { updatedComment, inId, outId } = action.payload;
      const replaceUser = `@${state.comments[outId].replies[inId].replyingTo}`;
      state.comments[outId].replies[inId].content = updatedComment.replace(
        replaceUser,
        ""
      );
      setStorage(state);
    },
    replyComment: (state, action) => {
      const { content, outId, inId } = action.payload;
      if (!isNaN(inId)) {
        const { replies } = state.comments[outId];
        const data = {
          id: replies.length,
          content,
          createdAt: Date.now(),
          score: 0,
          replyingTo: replies[inId].user.username,
          user: state.currentUser,
        };
        replies.push(data);
        setStorage(state);
        return;
      }
      const { user, replies } = state.comments[outId];
      const data = {
        id: replies.length,
        content,
        createdAt: Date.now(),
        score: 0,
        replyingTo: user.username,
        user: state.currentUser,
      };
      replies.push(data);
      setStorage(state);
    },
    voteComment: (state, action) => {
      const { vote, outId, inId } = action.payload;
      if (!isNaN(inId)) {
        state.comments[outId].replies[inId].score = vote;
        setStorage(state);
        return;
      }
      state.comments[outId].score = vote;
      setStorage(state);
    },
  },
});

export const {
  addComment,
  removeComment,
  updateComment,
  replyRemove,
  replyUpdate,
  replyComment,
  voteComment,
} = commentData.actions;
export default commentData.reducer;
