import { Button, Image, Modal } from 'antd';
import { ServiceCalendar } from 'app/models/service-calendar';
import utilDateTime from 'app/utils/date-time';
import React from 'react';
import { BiTimeFive } from 'react-icons/bi';
import './style.scss';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import Slider from "react-slick";
import TakeCareStatusComp from 'app/components/status/TakeCareStatusComp';

interface ServiceReportDetailProps{
    orderCode: string;
    serviceCalendar: ServiceCalendar
    onClose: () => void
}

const ServiceReportDetail: React.FC<ServiceReportDetailProps> = ({orderCode, serviceCalendar, onClose}) => {
    const settings = {
        dots: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: false,
        prevArrow: <GrFormPrevious />,
        nextArrow: <GrFormNext />,
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            }
          ]
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
                        <p>Thời gian chăm sóc</p>
                    </div>
                    <div className="content">
                        <p>{utilDateTime.dateToString(serviceCalendar.serviceDate.toString())}</p>
                    </div>
                    <div className="status">
                        <TakeCareStatusComp status={serviceCalendar.status} />
                    </div>
                </div>
                {
                    (serviceCalendar.images && serviceCalendar.images.length !== 0) && 
                    <>
                        <h3>Hình ảnh</h3>
                        <div className="report-images">
                            {
                                <Slider {...settings}>
                                    {
                                        serviceCalendar.images.map((item, index) => (
                                            <div key={index} className='image-item-wrapper'>
                                                <Image src={item} alt="/" className='image-item-detail' />
                                            </div>
                                        ))
                                    }
                                </Slider>
                            }
                            {/* {
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
                            } */}
                        </div>
                    </>
                }
                {
                    (serviceCalendar.sumary && serviceCalendar.sumary.trim()) &&
                    <>
                        <h3>Mô tả</h3>
                        <div className="report-description">
                            <p>{serviceCalendar.sumary}</p>
                        </div>
                    </>
                }
            </div>
            <div className='btn-form-wrapper mt-10'>
                <Button type='primary' className='btn-update' size='large' onClick={onClose}>
                    Đóng
                </Button>
            </div>
        </Modal>
    )
}

export default ServiceReportDetail