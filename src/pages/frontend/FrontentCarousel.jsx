import Carousel from 'react-bootstrap/Carousel';

function FrontendCarousel() {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="assets/images/football-background.jpg"
                    alt="First slide"
                />
                <Carousel.Caption className='martext'>
                    <h1 className='title-welcome'><b>ຍິນດີຕ້ອນຮັບທ່ານ</b></h1>
                    <h5>ຂໍຂອບໃຈລູກຄ້າທີ່ໃຊ້ບໍລິການ</h5>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="assets/images/football-background.jpg"
                    alt="Second slide"
                />

                <Carousel.Caption>
                    <h1 className='title-welcome'><b>ຍິນດີຕ້ອນຮັບທ່ານ</b></h1>
                    <h5>ຂໍຂອບໃຈລູກຄ້າທີ່ໃຊ້ບໍລິການ</h5>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="assets/images/football-background.jpg"
                    alt="Third slide"
                />

                <Carousel.Caption>
                    <h1 className='title-welcome'><b>ຍິນດີຕ້ອນຮັບທ່ານ</b></h1>
                    <h5>ຂໍຂອບໃຈລູກຄ້າທີ່ໃຊ້ບໍລິການ</h5>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default FrontendCarousel;