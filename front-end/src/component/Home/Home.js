import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import APIs, { endpoints } from '../Configs/APIs';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const Home = () => {
    const [latestPosts, setLatestPosts] = useState([]);
    const [recentPost, setRecentPost] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const latestResponse = await APIs.get(endpoints['blogs'], {
                    params: { action: 'latest', page: 1 },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setLatestPosts(latestResponse.data.results);

                const recentResponse = await APIs.get(endpoints['blogs'], {
                    params: { action: 'recent' , page: 1 },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setRecentPost(recentResponse.data.results);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const getPostPreviewContent = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const image = doc.querySelector('img');

        if (image) {
            return <Card.Text><em>{image.alt}</em></Card.Text>;
        } else {
            const paragraphs = Array.from(doc.querySelectorAll('*'));
            const combinedText = paragraphs.map(p => p.textContent).join(' ');
            const textContent = combinedText.length > 150 ? combinedText.substring(0, 150) + "..." : combinedText;
            return <Card.Text>{textContent}</Card.Text>;
        }
    };

    const urlMotto = "https://s3-alpha-sig.figma.com/img/ea1d/b6ea/8e4ee7179d1a08dab4331e718e296c06?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=mnbAbBlChiXNePD87VKyMEj-ZN4wKjRHjfDOgKUf~YRA8ugi44kJDh760gCxnY2GZ~Ey67pe9b8oog~zBlC0bMIXLIMj4gzU88lo4mwQG20BJfTRRORZl1XbnTK6gXn~B0pkqBNf6pL-HWnJoOZ8jPP7TJVah5KUPrGuSe4Tlq3tNH1bt-1fKtNvDXoJwUEgrKcUlPqTjQ44yXM~ygqN8B629dpZ~4P3qpYIAYCRuzZ7HYedHhHKbWCYjVWLsYRYKmIygYu-9tiDqKAhEdik7jDuA3e~svDdAgQj1w6aTLtdR1tcBKYJh2c8O~EAcRGjt9CjuX9G8WU03Fg-DRGByA__";
    const urlFeatured = "https://s3-alpha-sig.figma.com/img/164c/d787/ea350e9fc17150e1651ebf2f43bf9919?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jlAuLGXehjrT2s7az1-NdWdj1BD-iU3uoH~xiO30cS1W9ya-xLqMjbZ~ThU5wwv-cYzMYrRCs~VpBmRPQGdgZgGw7UsiEPxRlXAquPwHshJx1aUrSAt0u9R2wjwaQjXMPZAJ4BScfi040t8DhRImU9Ux-wY4OX2lxfh-TmjmgA1qAALzV2~cYMGJhXCaJjPHpUzcEBXCtB7YjkpYpO~arVH-LaZmVx73fVtX~W6KnmUgdwsikDttFj9HhF83lDjdNcpLGPU~NyiKaVpFM9QMXr5cVQfgYGQhA~tTqNiVH2HZXzC5sySkY2Cck3irTtistXHTgcopSOIKelYu8wwLUg__";

    return (
        <div className='home'>
            <div className='motto'>
                <div className='detailheader'>
                    <h1>LIFE MOTTO</h1>
                </div>
                <div className='content'>
                    <div className='contentmotto'>
                        <div id='content'>” I always get to where I’m going by walking away from where I have been.”</div>
                        <div id='name'>― Winnie the Pooh, A.A. Milne</div>
                    </div>
                    <Image src={urlMotto} alt='motto image' fluid />
                </div>
            </div>
            {loading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <>
                    <div className='featured'>
                        <h1>FEATURED POST</h1>
                    </div>
                    {latestPosts.length > 0 && (
                        <Row className='featuredpost'>
                            <Col md={4} mx={6}><Image src={urlFeatured} alt='FEATURED POST IMAGE' id='imgfeatured' /></Col>
                            <Col mx={2}></Col>
                            {latestPosts.map((post) => (
                                <Col key={post.id} md={4} mx={4}>
                                    <Card className="custom-card">
                                        <div className="card-image-container">
                                            <p>My Thoughts</p>
                                            <Card.Img variant="top" src={post.cover_image} className="card-image" />
                                        </div>
                                        <Card.Body>
                                            <Link to={`/blogs/${post.slug}`} style={{ textDecoration: 'none' }}><Card.Title className='title'>{post.title}</Card.Title></Link>
                                            {getPostPreviewContent(post.content)}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}

                    <div className='recent'>
                        <h1>RECENT POST</h1>
                    </div>
                    {recentPost.length > 0 && (
                        <div className='recentpost'>
                            {recentPost.slice(0, 3).map((post) => (
                                <div key={post.id} className='postcard'>
                                    <div><Image src={post.cover_image} alt={post.title} /></div>
                                    <div className='custom-card'>
                                        <div className='datetime'>
                                            {format(new Date(post.create_date), 'dd/MM/yyyy')} - {formatDistanceToNow(new Date(post.create_date), { addSuffix: true, locale: vi })}
                                        </div>
                                        <div className='title'>{post.title}</div>
                                        <div className='contentrecent'>
                                            <p>{getPostPreviewContent(post.content)}</p>
                                        </div>
                                        <div className='btnblog'>
                                            <Link to={`/blogs/${post.slug}`} className="btn btn-primary">
                                                All Post
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
