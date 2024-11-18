import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './component/Home/Home';
import Header from './component/Layout/Header';
import Footer from './component/Layout/Footer';
import Login from './component/User/Login';
import { Container } from 'react-bootstrap';
import "./component/Styles/MyStyle.css";
import Register from './component/User/Register';
import About from './component/Home/About';
import CreateBlog from './component/Blog/CreateBlog';
import DetailBlog from './component/Blog/DetailBlog';
import AllBlog from './component/Home/AllBlog';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/createpost" element={<CreateBlog />} />
          <Route path="/blogs/:slug" element={<DetailBlog />} />
          <Route path="/blog" element={<AllBlog />} />
        </Routes>
      </Container>
      <Routes>
        <Route path='/' element={<Footer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
