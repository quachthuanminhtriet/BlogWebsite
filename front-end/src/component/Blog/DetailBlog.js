import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import APIs, { authAPIs, endpoints } from '../Configs/APIs';
import { Button } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import cookie from "react-cookies"  

const DetailBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate(); 
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [blogId, setBlogId] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await authAPIs().get(endpoints['current-user']);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await APIs.get(`${endpoints['blogs']}${slug}/increment-views/`);
        setBlog(res.data);
        setBlogId(res.data.id);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await APIs.get(endpoints['comments'], {
          params: { blog_slug: slug },
        });
        setComments(res.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    fetchComments();
  }, [slug]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    // Kiểm tra nếu người dùng chưa đăng nhập
    if (!user) {

      alert("You must be logged in to comment.");
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!newComment.trim()) return;

    const scrollPosition = window.scrollY;
    setLoading(true);

    try {
      const res = await APIs.post(endpoints['comments'], {
        user: user.id,
        content: newComment,
        blog: blogId,
      }, {
        headers: {
          'Authorization': `Bearer ${cookie.load('access-token')}`
        }
      });
      setComments([res.data, ...comments]);
      setNewComment('');
      window.scrollTo(0, scrollPosition);
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blog) {
    return <div>Blog not found.</div>;
  }

  const handleCancel = () => {
    setNewComment('');
  };

  // Sanitize and display content
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <div className="blog">
      <div className="detail-blog">
        <div className="blog-header">
          <div className="details">
            <p className="blog-date">
              {new Date(blog.create_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p className="views">
              <strong>Views: </strong>{blog.views}
            </p>
          </div>
          <h1 className="blog-title">{blog.title}</h1>
        </div>
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </div>

      <div className="comments">
        <h1>Comments</h1>
        <div className="all-comments">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className='user'>
                <p className="comment-user">{comment.user_first_name}</p>
                <p className='datetime'>{formatDistanceToNow(new Date(comment.create_date), { addSuffix: true })}</p>
              </div>
              <p className="comment-text">{comment.content}</p>
              <p className="comment-date">
                {new Date(comment.create_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>

        <div className="space"></div>

        <div className="add-comment">
          <input
            placeholder="Write a comment..."
            value={newComment}
            onChange={handleCommentChange}
          />
          <div className="button-comment">
            <Button id="cancel" onClick={handleCancel}>
              Cancel
            </Button>
            <Button id="add" onClick={handleCommentSubmit}>
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBlog;
