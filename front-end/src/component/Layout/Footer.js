import { Button, Form, Image } from "react-bootstrap";
import emailjs from 'emailjs-com';

const Footer = () => {
    const urlX = "https://s3-alpha-sig.figma.com/img/fc1e/243d/42adae1dce02bc51bf93aa48854c8014?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Jk1CJY6mR3FuyWANWKHL7CnQix7R~uIMA3jsdfSyL1PnbQr41tNpSpe6fXmcddFXRxtd8k1B3w3pCt2xGbV-TgKCDdjv1k9phpsXD3AH5udb2Waj8M8E0JVNxI1Luzsm8BhVbr-CjY3Tes4LGfCnp8VNYu18WqtaHVhjbWqmSCbtfWeggpI0uFD2stiQOl0v1yCHidN7lK52BepORO6FVt-rJ9DclaiTKTOHz0kPvQCrNd9~BkKAtE~UO~gp0mD~Tw0jDPvKiPdVbt70epjzKUPuTIekJ4UPpO~bT52p-uHTFSNC9ApIZuDMuITnPaVkEQNHqqWl0HGLF0P2cBuTDw__";
    const urlI = "https://s3-alpha-sig.figma.com/img/ac25/54e4/f1324b01768b26cb3bea3c0d7a37a0fd?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nPwO-COVr0f7ciEMg686dgC7490GAapZ5PjVplg4rtGCbdvWWTFtrHBhOzkVQzwNTKv18V~PTZVwLQ~PkyX3z2SHe6~1sRSzH5N2rfbirkNJpbz0453ovBQavjX1Gq~ZWqxdS0P~gKVmYn41Bx211sAqScGQrt76ZDaXm3kWi6zOS1V3wOm0MSWEWhHU6YNEBNJMehOnBLp5bWxXu6Vi40tsQOwyq8d~~IdQV6jTjc3bnNkyIoNOfGAN4uL6cZ-oqN2OGFixLuH02aqFfgZHxMk-0pQZmtgrl1Oh6X2g~1VjOMv8V1-gdnmbG2wmitLlJfEBNuftSGLvONMIPTYNBw__";
    const urlF = "https://s3-alpha-sig.figma.com/img/a846/7624/0b53d93fe9d2c3fa4089b88bf1464821?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=XwkwNj3bE28TizlnYsSgYGHas8oYrQYzPNZQYfb8YEaGkIywnP-SCCP3tyLH6SSWUuE8s-GvpBPGZ~BNmgrXU0eNjOS1vzNDcqrKmMwa7artgm8bfv1aYSsSCXsVWO8KuFayJnXHXBakm7lQND0GcvLu~ChlKuj39iFYH5WlxygWG4REawAK8QeHJDYu2Ryyc2uSjfZUmHlm2hBK1M6vA0mCfLkG3xgq-OUZhT7QRDh0DLNLGrPWiF9NYoi0KaRjtFxpUg9Is1QMTpvX-1Oyf7QNMtY-isQSVkmUzUY~l3x1Nljx3~uZAz5EMbHYNTK9XWDts~P9x5vGC-1JoElf4g__";

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const email = formData.get("email");
        const content = formData.get("content");

        const templateParams = {
            firstName,
            lastName,
            email,
            content,
        };

        // Gửi email thông qua EmailJS
        emailjs
            .send(
                'service_fld4rgp', // Dịch vụ của bạn
                'template_6htridw', // Template của bạn
                templateParams,
                'rpU4Aq6dhP59KyggT' // User ID của bạn
            )
            .then(
                (result) => {
                    console.log(result.text);
                    alert('Message sent successfully!');
                },
                (error) => {
                    console.log(error.text);
                    alert('Failed to send message. Please try again.');
                }
            );
    };

    return (
        <div className="footer" id="footer-contact">
            <div className="information">
                <div className="logolink">
                    <Image src={urlX}></Image>
                    <Image src={urlI}></Image>
                    <Image src={urlF}></Image>
                </div>
                <div className="name">Blog Chill</div>
                <div className="infor">
                    <ul>
                        <li>123-456-7890</li>
                        <li>vittv@gmail.com</li>
                        <li>triet123az@gmail.com</li>
                        <li>&copy; 2025 by Blog Chill.</li>
                        <li>Powered and secured by QTMT and TTV</li>
                        <li>Made and created by QTMT and TTV</li>
                    </ul>
                </div>
            </div>
            <div className="contact">
                <div id="text-1">Contact</div>
                <div id="text-2">Ask me anything</div>
                <Form className="container mt-4 submitform" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 fullname" controlId="formFullName">
                        <Form.Group className="mb-3" controlId="formFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your first name" name="firstName" />
                        </Form.Group>
                        <Form.Group className="mb-3 mx-3" controlId="formLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your last name" name="lastName" />
                        </Form.Group>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="name@example.com" name="email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formContent">
                        <Form.Label>Content</Form.Label>
                        <Form.Control type="text" placeholder="Enter content" name="content" />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Footer;
