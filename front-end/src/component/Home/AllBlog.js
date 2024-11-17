import React, { useEffect, useState, useCallback } from 'react';
import APIs, { authAPIs, endpoints } from '../Configs/APIs';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaRegCommentDots, FaRegHeart } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';

const AllBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cookies] = useCookies(['access-token']);
    const [userName, setUserName] = useState('');

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await APIs.get(endpoints['blogs'], {
                params: { page: currentPage, action: 'recent' },
                headers: { Authorization: `Bearer ${cookies['access-token']}` }
            });

            if (response.data && response.data.results) {
                setBlogs(response.data.results);
                const totalPages = Math.ceil(response.data.count / 4);
                setTotalPages(totalPages);
            } else {
                setBlogs([]);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, cookies]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            setLoading(true);
            try {
                const res = await authAPIs().get(endpoints['current-user'], {
                    headers: { Authorization: `Bearer ${cookies['access-token']}` }
                });
                setUserName(res.data.role);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error fetching current user:', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        const checkAuthStatus = () => {
            return !!cookies['access-token'];
        };

        if (checkAuthStatus()) {
            fetchCurrentUser();
        } else {
            setIsLoggedIn(false);
        }
    }, [cookies]);

    const getBlogPreviewContent = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const image = doc.querySelector('img');

        if (image) {
            return <Card.Text><em>{image.alt}</em></Card.Text>;
        } else {
            const firstParagraph = doc.querySelector('*');
            const textContent = firstParagraph ? firstParagraph.textContent.trim() : "";
            const previewText = textContent.length > 150 ? textContent.substring(0, 150) + "..." : textContent;
            return <Card.Text>{previewText || "No preview available"}</Card.Text>;
        }
    };

    const toggleLike = async (blogId, liked) => {
        try {
            const response = await APIs.post(endpoints['toggle-like'](blogId), {}, {
                headers: { Authorization: `Bearer ${cookies['access-token']}` }
            });

            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog.id === blogId
                        ? {
                            ...blog,
                            liked: response.data.liked,
                            likes: response.data.likes_count,
                        }
                        : blog
                )
            );
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <div className="allblog">
            <header className="detailheader">
                <h1>BLOGS</h1>
                {isLoggedIn && userName === 'blogger' && (
                    <div className='add'><Link to='/createpost'>+</Link></div>
                )}
            </header>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <Row className="g-4">
                    {blogs.length === 0 ? (
                        <p>No blogs available.</p>
                    ) : (
                        blogs.map((blog) => (
                            <Col key={blog.id} className="blog-post" md={6}>
                                <Card>
                                    <Card.Img variant="top" src={blog.cover_image} alt="Blog Image" />
                                    <Card.Body>
                                        <Card.Title>
                                            <Link to={`/blogs/${blog.slug}`} className='buttonall'>{blog.title}</Link>
                                        </Card.Title>
                                        {getBlogPreviewContent(blog.content)}
                                    </Card.Body>
                                    <Card.Footer>
                                        <div className='view_comment'>
                                            <div className='views'>
                                                <IoEyeOutline style={{ width: '40px', fontSize: '20px' }} />
                                                <div>{blog.views}</div>
                                            </div>
                                            <div className='comments'>
                                                <FaRegCommentDots style={{ width: '40px', fontSize: '20px' }} />
                                            </div>
                                        </div>
                                        <div className='like'>
                                            <div>{blog.likes}</div>
                                            <Button
                                                className="likes"
                                                style={{
                                                    width: '40px',
                                                    fontSize: '20px',
                                                    color: blog.liked === true ? 'red' : 'black',
                                                }}
                                                onClick={() => toggleLike(blog.id)}
                                            >
                                                <FaRegHeart color={blog.liked === true ? 'red' : 'black'} />
                                            </Button>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            )}

            <div className="pagination">
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllBlog;
