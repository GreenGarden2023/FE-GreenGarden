import { Button, DatePicker, DatePickerProps, Form, Image, Input, Modal } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import useDispatch from 'app/hooks/use-dispatch'
import { ServiceOrderDetail } from 'app/models/service'
import { CalendarUpdate, ServiceCalendar } from 'app/models/service-calendar'
import fileService from 'app/services/file.service'
import serviceCalendar from 'app/services/service-calendar.service'
import uploadService from 'app/services/upload.service'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import utilDateTime from 'app/utils/date-time'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { GrFormClose, GrFormNext, GrFormPrevious } from 'react-icons/gr'
import Slider from "react-slick"
import './style.scss'

interface UploadCalendarProps{
    serviceCalendarDetail: ServiceCalendar
    serviceOrderDetail: ServiceOrderDetail
    onClose: () => void
    onSubmit: (prev: ServiceCalendar, next?: ServiceCalendar) => void
}

const UploadCalendar: React.FC<UploadCalendarProps> = ({ serviceCalendarDetail, serviceOrderDetail, onClose, onSubmit }) => {
    const dispatch = useDispatch()

    const ref = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<string[]>([])
    const [sumary, setSumary] = useState('')
    const [date, setDate] = useState<Dayjs | null>(null)
    const [loading, setLoading] = useState(false)

    const IsEndDate = useMemo(() =>{
        return (dayjs(new Date()).valueOf() >= dayjs(serviceOrderDetail.serviceEndDate).valueOf()) ||
        (dayjs(serviceCalendarDetail.serviceDate).valueOf() >= dayjs(serviceOrderDetail.serviceEndDate).valueOf())
    }, [serviceOrderDetail.serviceEndDate, serviceCalendarDetail.serviceDate])

    useEffect(() =>{

        const currentDate = new Date(serviceCalendarDetail.serviceDate)

        if(IsEndDate){
            setDate(null)
            return;
        }

        currentDate.setDate(currentDate.getDate() + 1)
        setDate(dayjs(currentDate))
    }, [serviceCalendarDetail.serviceDate, serviceOrderDetail.serviceEndDate, IsEndDate])

    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) =>{
        const files = e.target.files
        if(!files) return;

        const finalFiles: File[] = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if(!fileService.isValidFile(file)){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.INVALID_FILE}))
                return;
            }
            finalFiles.push(file)
        }
        // validate File
        const res = await uploadService.uploadListFiles(finalFiles)
        setImages([...images, ...res.data])
    }
    const handleRemoveImage = (index: number) =>{
        images.splice(index, 1)
        setImages([...images])
    }

    const handleChangeDateUpdateCalendar: DatePickerProps['onChange'] = (date, dateString) =>{
        setDate(date)
    }

    const isValidBeforeSubmit = () =>{
        if(images.length === 0){
            dispatch(setNoti({type: 'error', message: 'Hình ảnh không được để trống'}))
            return false
        }

        if(sumary.length > 500){
            dispatch(setNoti({type: 'error', message: 'Mô tả không nhiều hơn 500 ký tự'}))
            return false
        }

        if(!IsEndDate){
            if(!date) {
                dispatch(setNoti({type: 'error', message: 'Lịch chăm sóc không được để trống'}))
                return false
            }
        }

        return true
    }

    

    const handleUploadCalendar = async () =>{
        if(!isValidBeforeSubmit()) return;
        setLoading(true)
        try{
            const body: CalendarUpdate = {
                images,
                nextServiceDate: !IsEndDate ? utilDateTime.dayjsToLocalString(dayjs(date)) : null,
                serviceCalendarId: serviceCalendarDetail.id,
                sumary
            }
            const res = await serviceCalendar.createServiceCalendar({calendarUpdate: body})
            
            // if(IsEndDate){
            //     // await orderService.updateServiceOrderStatus(serviceOrderDetail.id, 'completed')
            //     // await serviceService.updateServiceRequestStatus(serviceOrderDetail.service.id, 'completed')
            //     onSubmit(res.data.previousCalendar, res.data.nextCalendar)
            //     dispatch(setNoti({type: 'success', message: 'Cập nhật thông tin chăm sóc và trạng thái đơn hàng thành công'}))
            //     onClose()
            //     setLoading(false)
            //     return;
            // }

            onSubmit(res.data.previousCalendar, res.data.nextCalendar)
            dispatch(setNoti({type: 'success', message: 'Cập nhật lịch chăm sóc thành công'}))
            onClose()
        }catch(e){
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
        setLoading(false)
    }

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
            title={`Cập nhật báo cáo cho ngày chăm sóc "${utilDateTime.dateToString(serviceCalendarDetail.serviceDate.toString())}"`}
            onCancel={onClose}
            footer={false}
            width={1000}
        >
            <Form
                layout='vertical'
                onFinish={handleUploadCalendar}
            >
                <input type='file' hidden ref={ref} accept='.png,.jpg,.jpeg' multiple onChange={handleUploadFile} />
                <button type='button' onClick={() => ref.current?.click()} className='btn btn-upload'>
                    <AiOutlineCloudUpload size={30} /> <span>Đăng tải hình ảnh chăm sóc</span>
                </button>
                {
                    images.length !== 0 &&
                    <div className="image-view-wrapper">
                        <Slider {...settings}>
                            {
                                images.map((item, index) => (
                                    <div key={index} className='image-view-item'>
                                        <div style={{position: 'relative'}}>
                                            <Image src={item} alt="/" />
                                            <GrFormClose size={30} onClick={() => handleRemoveImage(index)} className='btn-remove-img' />
                                        </div>
                                    </div>
                                ))
                            }
                        </Slider>
                    </div>
                }
                <Form.Item label='Mô tả' style={{marginTop: '30px'}}>
                    <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} value={sumary} onChange={(e) => setSumary(e.target.value)} ></Input.TextArea>
                </Form.Item>
                {
                    !IsEndDate &&
                    <Form.Item label='Chọn ngày chăm sóc tiếp theo'>
                        <DatePicker
                            locale={locale} 
                            format={CONSTANT.DATE_FORMAT_LIST}
                            disabledDate={(current) => current && (current.valueOf()  <= dayjs(serviceCalendarDetail.serviceDate).valueOf() ||
                            current.valueOf() > dayjs(serviceOrderDetail.serviceEndDate).valueOf())}
                            onChange={handleChangeDateUpdateCalendar}
                            style={{width: 250}}
                            value={date}
                            disabled={dayjs(new Date()).valueOf() >= dayjs(serviceOrderDetail.serviceEndDate).valueOf()}
                        />
                    </Form.Item>
                }
                <div className='btn-form-wrapper'>
                    <Button htmlType='button' disabled={loading} type='default' size='large' className='btn-cancel' onClick={onClose}>Hủy bỏ</Button>
                    <Button htmlType='submit' loading={loading} type='primary' className='btn-update' size='large'>
                        Cập nhật
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default UploadCalendar