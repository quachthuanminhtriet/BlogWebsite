import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DetailPost = () => {
  const { slug } = useParams();  // Get slug from URL
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/blogs/${slug}/increment-views/`);
        console.log(response.data);  // Log the response
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, [slug]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail-post-container">
      <div className="post-header">
        <h1 className="post-title">{blog.title}</h1>
        <p className="post-date">{new Date(blog.create_date).toLocaleDateString()}</p>
        {blog.cover_image && (
          <img className="cover-image" src={blog.cover_image} alt={blog.title} />
        )}
      </div>

      <div className="post-content">
        <p>{blog.content}</p>
      </div>

      <div className="post-footer">
        <p><strong>Views: </strong>{blog.views}</p>
      </div>
    </div>
  );
};

export default DetailPost;
