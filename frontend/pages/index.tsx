"use client";
import { useState, useEffect } from "react";

type Post = {
  id: number;
  caption: string;
  likes: number;
};

const API_URL = "PUT_YOUR_RENDER_URL_HERE";

export default function Home() {
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchPosts() {
    const res = await fetch(`${API_URL}/posts`);
    const data = await res.json();
    setPosts(data);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function addPost() {
    if (!caption.trim()) return;

    setLoading(true);

    await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ caption }),
    });

    setCaption("");
    await fetchPosts();
    setLoading(false);
  }

  async function likePost(id: number) {
    await fetch(`${API_URL}/posts/${id}/like`, {
      method: "POST",
    });

    await fetchPosts();
  }

  async function deletePost(id: number) {
    await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
    });

    await fetchPosts();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 30 }}>Mini Instagram</h1>

        <div
          style={{
            background: "white",
            padding: 20,
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            marginBottom: 30,
          }}
        >
          <label style={{ display: "block", marginBottom: 10, fontWeight: 600 }}>
            Caption
          </label>

          <input
            type="text"
            placeholder="Write caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ddd",
              marginBottom: 15,
            }}
          />

          <button
            onClick={addPost}
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "none",
              background: "black",
              color: "white",
              cursor: "pointer",
            }}
          >
            {loading ? "Posting..." : "Post"}
          </button>

          <p style={{ marginTop: 15 }}>
            Preview: <b>{caption || "(empty)"}</b>
          </p>
        </div>

        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: "white",
              padding: 20,
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              marginBottom: 20,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 10 }}>@aruna</div>

            <p style={{ marginBottom: 16 }}>{post.caption}</p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => likePost(post.id)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                ❤️ {post.likes}
              </button>

              <button
                onClick={() => deletePost(post.id)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}