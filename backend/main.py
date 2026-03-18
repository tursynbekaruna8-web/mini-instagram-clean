from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_connection():
    conn = sqlite3.connect("instagram.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            caption TEXT NOT NULL,
            likes INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()

create_table()

class Post(BaseModel):
    caption: str

def add_likes_column():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE posts ADD COLUMN likes INTEGER DEFAULT 0")
        conn.commit()
    except:
        pass
    conn.close()

add_likes_column()

@app.get("/")
def home():
    return {"message": "Backend is running"}

@app.get("/posts")
def get_posts():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM posts ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    posts = []
    for row in rows:
        posts.append({
            "id": row["id"],
            "caption": row["caption"],
            "likes": row["likes"]
        })

    return posts

@app.post("/posts")
def create_post(post: Post):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO posts (caption, likes) VALUES (?, ?)",
        (post.caption, 0)
    )
    conn.commit()
    conn.close()

    return {"status": "post added", "caption": post.caption}

@app.post("/posts/{post_id}/like")
def like_post(post_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE posts SET likes = likes + 1 WHERE id = ?", (post_id,))
    conn.commit()
    conn.close()

    return {"status": "liked", "post_id": post_id}

@app.delete("/posts/{post_id}")
def delete_post(post_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM posts WHERE id = ?", (post_id,))
    conn.commit()
    conn.close()

    return {"status": "deleted", "post_id": post_id}