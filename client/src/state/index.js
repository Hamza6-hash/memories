import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    mode: "light",
    user: null,
    token: null,
    users: [],
    posts: [],
    userPosts: [],
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light"
        },
        setLogin: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        setLogout: (state) => {
            state.user = null
            state.token = null
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        },
        setFollowers: (state, action) => {
            if (state.user) {
                state.user.followers = action.payload.followers
            } else {
                console.log("Followers not-exist :(")
            }
        },
        deleteePost: (state, action) => {
            const deletedPostId = action.payload.id;
            const updatedPosts = state.posts.filter((post) => post._id !== deletedPostId);
            state.posts = updatedPosts;
        },
        setUserPosts: (state, action) => {
            state.userPosts = action.payload.userPosts
        },
        setUserPost: (state, action) => {
            const updatedUserPosts = state.userPosts.map((userPost) => {
                if (userPost._id === action.payload.userPost._id) return action.payload.userPost;
                return userPost
            });
            state.userPosts = updatedUserPosts
        },
        deleteeUserPost: (state, action) => {
            const deletedUserPostId = action.payload.id
            const updatedUserPosts = state.userPosts.filter((post) => post._id !== deletedUserPostId);
            state.userPosts = updatedUserPosts
        }
    }
})

export const { setMode, setLogin, setLogout, setUsers, setPosts, setPost, deleteePost, setUserPosts, setUserPost, deleteeUserPost } = authSlice.actions

export default authSlice.reducer