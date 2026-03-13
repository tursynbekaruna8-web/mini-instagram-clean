"use client";
import { useState, useEffect } from "react";

type Post = {
  id?: number;
  caption: string;
};

export default function Home() {
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [apiPosts, setApiPosts] = useState<any[]>([]);

  // Backend-тен посттарды алу
  async function fetchPosts() {
    const res = await fetch("https://mini-instagram-1-12tw.onrender.com/posts");
    const data = await res.json();
    setPosts(data);
  }

  // Жаңа пост қосу
  const addPost = async () => {
    if (!caption.trim()) return;

    await fetch("https://mini-instagram-1-12tw.onrender.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caption: caption,
      }),
    });

    setCaption("");
    fetchPosts(); // жаңа посттан кейін қайта жүктейміз
  };

  // Fake API посттарын алу
  async function loadPosts() {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    setApiPosts(data.slice(0, 5));
  }

  // Сайт ашылғанда backend посттарын автоматты алу
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>Mini Instagram</h1>

      <label style={{ display: "block", marginTop: 20 }}>
        Caption:
      </label>

      <input
        type="text"
        placeholder="Write caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={{ padding: 10, width: 320 }}
      />

      <button onClick={addPost} style={{ marginLeft: 10 }}>
        Post
      </button>

      <button onClick={loadPosts} style={{ marginTop: 20, marginLeft: 10 }}>
        Load API Posts
      </button>

      <div style={{ marginTop: 30 }}>
        <h2>My Backend Posts</h2>
        {posts.map((post, index) => (
          <div
            key={post.id ?? index}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              width: 360,
              borderRadius: 10,
              marginBottom: 15,
            }}
          >
            <b>@aruna</b>
            <p style={{ marginTop: 10 }}>{post.caption}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Fake API Posts</h2>
        {apiPosts.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid gray",
              marginBottom: 10,
              padding: 10,
              width: 360,
              borderRadius: 10,
            }}
          >
            <b>{p.title}</b>
            <p>{p.body}</p>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 20 }}>
        Preview: <b>{caption || "(empty)"}</b>
      </p>
    </main>
  );
}