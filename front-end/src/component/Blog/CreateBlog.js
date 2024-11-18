import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner, Image } from 'react-bootstrap';
import APIs, { authAPIs, endpoints } from '../Configs/APIs';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const urlImg = 'https://s3-alpha-sig.figma.com/img/ff1e/410a/6c87ad6366e939d5edeba6f79301c5f4?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=COgi~80OrGodfvU4AH8bUHMKnoU2XdgVifTStdRcSoQpWz97~0tcTlfrTAO4-GUZaNJZ8WkHZ5ySAYoAVeBVFU2h7XNx4lZv3FhJA04R2u4ZS31EoawuszDZP9RC6KLsvKHOwyGlgpHE9HSdogKjQ~6sPk68r7cDOgqgU7mjSZEm24T8OlolOXLDWABTldt1I1ur-nL2AjhBW9gAnYZptvuydgZGdbdpOYkq5htQ2akW1l-N-NeGt8siXrJvw1BaCWAiQqw8K7Sfqsc8h78Q0sVVrjyYRw9SpEFiCVzx-LWhE5uc44~May0dNtuPLe5DTS0BcP1GHXBemCtbwYjzVw__';
    const urlReset = 'https://s3-alpha-sig.figma.com/img/d57f/3946/154094c258547801cec267b5a54a2bc3?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=F5MlAcZkBTB~m3cgjqfJJ7QLElbhEnanAx47N073dBJnTBcy5OpBRGKvLTh2sMqeFq0ZRC8Gp7NdNzduIQ2TbrxRZruykQXS0SLaYGliVAlFGxubB9rakb-n--JZOm52Sma0cfwqpHYtjPRLqFHbyJpO4fU6fBIU2Xbg7Bv6z7Aei3Url-qX4k0zRNhGd70EDaH70vq1s1Nx81-BO7GWJ-r3EFqPcvlPQxMYXFfbcHvhI2uD-O-L~~oyfhz0VH2MRGATNyY4LeXPvtPLdyV1itWdgOPz-SGDQtgBeWh-3TxhwvyNwBsBEQsxsd~BMvZVR2k-YqCQMp1b-8A1-VoEXQ__';

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (value) => setContent(value);
    const handleCoverImageChange = (e) => setCoverImage(e.target.files[0]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('active', true);
        formData.append('title', title);
        formData.append('content', content);
        if (coverImage) formData.append('cover_image', coverImage);
        formData.append('author', user.id);

        try {
            await APIs.post(endpoints['createblogs'], formData, {
                headers: {
                    'Authorization': `Bearer ${cookie.load('access-token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Post created successfully!');
            setTitle('');
            setContent('');
            setCoverImage(null);
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setTitle('');
        setContent('');
        setCoverImage(null);
    };

    return (
        <div className='createblogs'>
            <div className='bgimg'>
                <Image src={urlImg} id='bgimg' />
            </div>
            <div className="detailheader">
                <h1>ADD-POST</h1>
            </div>

            <Form onSubmit={handleSubmit} className='formsubmit'>
                <div className='formblog'>
                    <Form.Group className="mb-3" controlId="formCoverImage">
                        <Form.Label>Cover Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleCoverImageChange}
                            accept="image/*"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            required
                            placeholder="Enter blog title...."
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formContent">
                        <Form.Label>Content</Form.Label>
                        <ReactQuill
                            value={content}
                            onChange={handleContentChange}
                            placeholder="Enter post content"
                            modules={{
                                toolbar: [
                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['bold', 'italic', 'underline'],
                                    [{ 'color': [] }, { 'background': [] }],
                                    [{ 'align': [] }],
                                    ['link', 'image'],
                                    ['clean']
                                ],
                            }}
                        />
                    </Form.Group>
                </div>

                <div className='submitbutton'>
                    <div className='space'></div>
                    <div className='submit'>
                        <Button id='cancel'>
                            <Link to="/">Cancel</Link>
                        </Button>

                        <Button variant="primary" id='create' type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Publish'}
                        </Button>
                    </div>

                    <div className='reset'>
                        <Button id='reset' onClick={handleReset}>
                            <Image src={urlReset} />
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default CreatePost;
