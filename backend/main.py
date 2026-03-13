from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection function
def get_connection():
    conn = sqlite3.connect("instagram.db")
    conn.row_factory = sqlite3.Row
    return conn


# Create table when app starts
def create_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            caption TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


create_table()


class Post(BaseModel):
    caption: str


@app.get("/")
def home():
    return {"message": "Backend is running"}


@app.post("/posts")
def create_post(post: Post):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO posts (caption) VALUES (?)", (post.caption,))
    conn.commit()
    conn.close()

    return {"status": "post added", "caption": post.caption}


@app.get("/posts")
def get_posts():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM posts")
    rows = cursor.fetchall()
    conn.close()

    posts = []
    for row in rows:
        posts.append({
            "id": row["id"],
            "caption": row["caption"]
        })

    return posts