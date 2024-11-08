import React from 'react';
import { Image } from 'react-bootstrap';

const About = () => {
    const urlImg = "https://s3-alpha-sig.figma.com/img/0f30/b72e/7049e3ec6fc322f9eef4ef959fd24ca8?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MhW1oUNv1RPgdAenpWEiPeY0XrBj2TPrgKQzm7ZrkVyuLUv0mf0xNsb3C76aYdxsA1Mts~6ZxorcfDJ4bZ~yqb2HKAH3d2yjnnpBqAvpRibzQ2MOfBMyq0hPzg8NJw72nJHu4A3ZlSnPOia3wB~IKdykV7qla7FqevY4VnHmnqN4a5q5oANGjZOpub4FgeXhgoYnuqUeHHn4JlCoEhZYPooeIaeXuMijH9YQMXcNM2mWPAkxkK8nS-WSyYUooqblYanKp9Qxu~JTZBsJvQHiX9U6NVNUX-YRS~1puDXodi-Jt~GPXUWLbL5Lz-91X54XtwZ5X8xKiOvjD~nro56hWA__";
    return (
        <div className="about">
            <header className="detailheader">
                <h1>ABOUT ME</h1>
            </header>
            <div className='contentimage'>
                <div className='detailimage'>
                    <Image src={urlImg} alt="detailimage" />
                </div>
                <div className='content'>
                    <h1>Hi! I’m LLKwong,</h1>
                    <h3>A mental health advocate & blogger </h3>
                    <p>I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I’m a great place for you to tell a story and let your users know a little more about you.<br />
                        This is a great space to write long text about your company and your services. You can use this space to go into a little more detail about your company. Talk about your team and what services you provide. Tell your visitors the story of how you came up with the idea for your business and what makes you different from your competitors. Make your company stand out and show your visitors who you are.<br />
                        At Wix we’re passionate about making templates that allow you to build fabulous websites and it’s all thanks to the support and feedback from users like you! Keep up to date with New Releases and what’s Coming Soon in Wix ellaneous in Support. Feel free to tell us what you think and give us feedback in the Wix Forum. If you’d like to benefit from a professional designer’s touch, head to the Wix Arena and connect with one of our Wix Pro designers. Or if you need more help you can simply type your questions into the Support Forum and get instant answers. To keep up to date with everything Wix, including tips and things we think are cool, just head to the Wix Blog!<br /></p>
                </div>
            </div>
        </div>
    );
};

export default About;
