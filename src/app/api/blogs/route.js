import { store } from "../../../db/store.js";
import { getAllBlogPosts } from "../../../lib/blog-data.js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const author = searchParams.get("author");

    let posts = getAllBlogPosts();

    if (category) {
      posts = posts.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }
    if (author) {
      posts = posts.filter((p) =>
        p.author?.name?.toLowerCase().includes(author.toLowerCase())
      );
    }

    return Response.json({
      success: true,
      total: posts.length,
      posts,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message || "Failed to load blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      excerpt,
      category,
      authorName,
      authorRole,
      tags,
      content,
      custom_html,
      custom_css,
      createdBy,
      featured,
    } = body;

    if (!title || !title.trim()) {
      return Response.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const newBlog = store.createBlog({
      title,
      excerpt,
      category: category || "Community Guides",
      authorName: authorName || "Community Member",
      authorRole: authorRole || "Video Contributor",
      tags: tags || ["Guide", "Video"],
      content: content || [],
      custom_html: custom_html || "",
      custom_css: custom_css || "",
      createdBy: createdBy || "user",
      featured: Boolean(featured),
    });

    return Response.json(
      {
        success: true,
        message: "Blog post published successfully!",
        blog: newBlog,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message || "Failed to create blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idOrSlug = searchParams.get("id") || searchParams.get("slug");

    if (!idOrSlug) {
      return Response.json(
        { success: false, error: "Missing id or slug parameter" },
        { status: 400 }
      );
    }

    const removed = store.deleteBlog(idOrSlug);
    if (!removed) {
      return Response.json(
        { success: false, error: "Blog post not found or cannot be deleted" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Blog post deleted successfully",
      blog: removed,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message || "Failed to delete blog" },
      { status: 500 }
    );
  }
}
