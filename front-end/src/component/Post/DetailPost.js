import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

const DetailPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blog && blog.slug === slug) return;

    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/blogs/${slug}/increment-views/`);
        console.log(response.data);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, blog]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blog) {
    return <div>Blog not found.</div>;
  }

  // Sanitize and display content
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <div className="detail-post-container">
      <div className="post-header">
        <h1 className="post-title">{blog.title}</h1>
        <p className="post-date">{new Date(blog.create_date).toLocaleDateString()}</p>
        {blog.cover_image && (
          <img className="cover-image" src={blog.cover_image} alt={blog.title} />
        )}
      </div>

      <div className="post-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

      <div className="post-footer">
        <p><strong>Views: </strong>{blog.views}</p>
      </div>
    </div>
  );
};

export default DetailPost;
