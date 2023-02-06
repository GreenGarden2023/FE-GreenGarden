import { Carousel } from 'antd';
import React from 'react';
import './style.scss';
import { MdNavigateNext } from 'react-icons/md';

// const contentStyle: React.CSSProperties = {
//     margin: 0,
//     height: '160px',
//     color: '#fff',
//     lineHeight: '160px',
//     textAlign: 'center',
//     background: '#364d79',
// };
const getPosById = (i: number) => {
    switch(i){
        case 1: return '--first'
        case 2: return '--second'
        case 3: return '--thirt'
    }
    return ''
}
const SliderLanding: React.FC = () =>{
    const onChange = (currentSlide: number) => {
        console.log(currentSlide);
    };

    return (
        <div className='slider-container'>
            <Carousel afterChange={onChange}>
                {
                    Array.from(Array(3), (_, index) => (
                        <div className="slider__item" key={index}>
                    {
                        Array.from(Array(3), (_, i) => (
                            <div className={`item__detail ${getPosById(i + 1)}`} key={i+1}>
                                <p className='title'>Các loại cây cảnh</p>
                                <p className='content'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint eius sit nisi suscipit accusamus vero perspiciatis ea unde fugit explicabo iste harum, provident impedit hic deleniti quaerat ducimus consectetur possimus.</p>
                                <button className="show-more-btn">
                                    <p>Show more</p>
                                    <MdNavigateNext className='icon-next' />
                                </button>
                            </div>
                        ))
                    }
                        </div>
                    ))
                }
            </Carousel>
        </div>
    );
}

export default SliderLanding;