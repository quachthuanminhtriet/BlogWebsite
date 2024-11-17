import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
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

    return (
        <div className='createblogs'>
            <div className='detailheader'>
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
                            placeholder="Enter post title"
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
                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
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
                    <Button id='cancel'>
                        <Link to="/">Cancel</Link>
                    </Button>

                    <Button variant="primary" id='create' type="submit" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Publish'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CreatePost;
