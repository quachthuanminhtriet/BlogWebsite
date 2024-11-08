import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import APIs, { endpoints } from '../Configs/APIs';

const Home = () => {
    const [latestPosts, setLatestPosts] = useState([]);
    const [hotPosts, setHotPosts] = useState([]);
    const [highlightedPost, setHighlightedPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch data for latest posts, hot posts, and highlighted post
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const latestResponse = await APIs.get(endpoints['blogs'], {
                    params: { action: 'latest' },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setLatestPosts(latestResponse.data);

                const hotResponse = await APIs.get(endpoints['blogs'], {
                    params: { action: 'hot' },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setHotPosts(hotResponse.data);

                const highlightedResponse = await APIs.get(endpoints['blogs'], {
                    params: { action: 'highlighted' },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setHighlightedPost(highlightedResponse.data[0]);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            <h2>Home</h2>
            {loading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <>
                    <h3>Latest Post</h3>
                    {latestPosts.length > 0 && (
                        <Row>
                            {latestPosts.map((post) => (
                                <Col key={post.id} md={4}>
                                    <Card>
                                        <Card.Img variant="top" src={post.cover_image} />
                                        <Card.Body>
                                            <Card.Title>{post.title}</Card.Title>
                                            <Card.Text>{post.content.substring(0, 100)}...</Card.Text>
                                            <Link to={`/blogs/${post.slug}`} className="btn btn-primary">
                                                Read More
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}

                    <h3>Hot Posts</h3>
                    {hotPosts.length > 0 && (
                        <Row>
                            {hotPosts.map((post) => (
                                <Col key={post.id} md={4}>
                                    <Card>
                                        <Card.Img variant="top" src={post.cover_image} />
                                        <Card.Body>
                                            <Card.Title>{post.title}</Card.Title>
                                            <Card.Text>{post.content.substring(0, 100)}...</Card.Text>
                                            <Link to={`/blogs/${post.slug}`} className="btn btn-primary">
                                                Read More
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}

                    {highlightedPost && (
                        <div>
                            <h3>Highlighted Post</h3>
                            <Card>
                                <Card.Img variant="top" src={highlightedPost.cover_image} />
                                <Card.Body>
                                    <Card.Title>{highlightedPost.title}</Card.Title>
                                    <Card.Text>{highlightedPost.content.substring(0, 100)}...</Card.Text>
                                    <Link to={`/blogs/${highlightedPost.slug}`} className="btn btn-primary">
                                        Read More
                                    </Link>
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
