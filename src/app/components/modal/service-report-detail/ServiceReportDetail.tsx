import { Image, Modal } from 'antd';
import { ServiceCalendar } from 'app/models/service-calendar';
import utilDateTime from 'app/utils/date-time';
import React from 'react';
import { BiTimeFive } from 'react-icons/bi';
import './style.scss';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import Slider from "react-slick";

interface ServiceReportDetailProps{
    orderCode: string;
    serviceCalendar: ServiceCalendar
    onClose: () => void
}

const ServiceReportDetail: React.FC<ServiceReportDetailProps> = ({orderCode, serviceCalendar, onClose}) => {
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <GrFormNext />,
        prevArrow: <GrFormPrevious />
    };
    return (
        <Modal
            open
            title={`Chi tiết báo cáo của đơn hàng "${orderCode}"`}
            onCancel={onClose}
            onOk={onClose}
            width={1000}
            footer={false}
        >
            <div className='report-wrapper'>
                <div className="report-time">
                    <div className="title">
                        <BiTimeFive size={20} color='#0099FF' />
                        <span>Thời gian chăm sóc</span>
                    </div>
                    <div className="content">
                        <span>{utilDateTime.dateToString(serviceCalendar.serviceDate.toString())}</span>
                    </div>
                </div>
                <h3>Hình ảnh</h3>
                <div className="report-images">
                    {
                        (serviceCalendar && serviceCalendar.images.length > 4) &&
                        <Slider {...settings}>
                            {
                                serviceCalendar.images.map((item, index) => (
                                    <div key={index} className='image-item-wrapper'>
                                        <img src={item} alt="/" className='image-item-detail' />
                                    </div>
                                ))
                            }
                        </Slider>
                    }
                    {
                        (serviceCalendar && serviceCalendar.images.length <= 4) &&
                        <Image.PreviewGroup>
                            {
                                serviceCalendar.images.map((x, index) => (
                                    <Image 
                                        src={x}
                                        key={index}
                                        className='image-item'
                                    />
                                ))
                            }
                        </Image.PreviewGroup>
                    }
                </div>
                <h3>Ghi chú</h3>
                <div className="report-description">
                    <p>{serviceCalendar.sumary}</p>
                </div>
            </div>
        </Modal>
    )
}

export default ServiceReportDetail