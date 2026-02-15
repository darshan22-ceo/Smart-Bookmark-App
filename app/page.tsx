"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // 🔐 Get current session properly
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;

      setUser(currentUser);

      if (currentUser) fetchBookmarks(currentUser.id);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;

        setUser(currentUser);

        if (currentUser) fetchBookmarks(currentUser.id);
        else setBookmarks([]);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 📌 Fetch bookmarks
  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  // ➕ Add bookmark
  const addBookmark = async () => {
    if (!title || !url) return alert("Enter title and URL");

    await supabase.from("bookmarks").insert([
      { title, url, user_id: user.id },
    ]);

    setTitle("");
    setUrl("");
    fetchBookmarks(user.id);
  };

  // ❌ Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    fetchBookmarks(user.id);
  };

  // 🔐 Google Login
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: { prompt: "select_account" },
      },
    });
  };

  // 🚪 Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // 🔒 LOGIN PAGE
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-700">
        <div className="bg-white p-10 rounded-2xl shadow-2xl text-center w-[350px]">

          <h1 className="text-3xl font-bold text-black mb-3">
            Smart Bookmark
          </h1>

          <p className="text-gray-600 mb-6">
            Secure bookmark manager
          </p>

          <button
            onClick={login}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // 🌟 DASHBOARD
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">
            My Bookmarks
          </h1>

          <div className="text-right">
            <p className="text-sm font-semibold text-black">
              {user.user_metadata?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-600">
              {user.email}
            </p>

            <button
              onClick={logout}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ADD BOOKMARK */}
        <div className="flex gap-3 mb-6">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-3 rounded w-1/3 text-black"
          />

          <input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-3 rounded flex-1 text-black"
          />

          <button
            onClick={addBookmark}
            className="bg-indigo-600 text-white px-6 rounded hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        {/* BOOKMARK LIST */}
        {bookmarks.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">
            No bookmarks yet 📌
          </p>
        ) : (
          <div className="grid gap-4">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                className="bg-gray-50 p-4 rounded-lg shadow flex justify-between"
              >
                <div>
                  <h2 className="font-semibold text-black">
                    {b.title}
                  </h2>

                  <a
                    href={b.url}
                    target="_blank"
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    {b.url}
                  </a>
                </div>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
