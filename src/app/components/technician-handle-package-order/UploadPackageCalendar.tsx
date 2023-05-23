import { Button, DatePicker, DatePickerProps, Form, Image, Input, Modal } from 'antd'
import useDispatch from 'app/hooks/use-dispatch'
import { PackageOrder } from 'app/models/package'
import { CalendarUpdate, ServiceCalendar } from 'app/models/service-calendar'
import utilDateTime from 'app/utils/date-time'
import React, { useMemo, useRef, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import Slider from "react-slick"
import { GrFormClose, GrFormNext, GrFormPrevious } from 'react-icons/gr'
import CONSTANT from 'app/utils/constant'
import locale from 'antd/es/date-picker/locale/vi_VN'
import fileService from 'app/services/file.service'
import { setNoti } from 'app/slices/notification'
import uploadService from 'app/services/upload.service'
import takeComboOrderService from 'app/services/take-combo-order.service'

interface UploadPackageCalendarProps{
    pkgOrder: PackageOrder
    serviceCalendar: ServiceCalendar
    onClose: () => void
    onSubmit: (prev: ServiceCalendar, next?: ServiceCalendar) => void
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

const UploadPackageCalendar: React.FC<UploadPackageCalendarProps> = ({pkgOrder, serviceCalendar, onClose, onSubmit}) => {
    const dispatch = useDispatch()

    const ref = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<string[]>([])
    const [sumary, setSumary] = useState('')
    const [date, setDate] = useState<Dayjs | null>(null)
    const [loading, setLoading] = useState(false)
    
    const IsEndDate = useMemo(() =>{
        return (dayjs(new Date()).valueOf() >= dayjs(pkgOrder.serviceEndDate).valueOf()) ||
        (dayjs(serviceCalendar.serviceDate).valueOf() >= dayjs(pkgOrder.serviceEndDate).valueOf())
    }, [pkgOrder.serviceEndDate, serviceCalendar.serviceDate])

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
                nextServiceDate: !IsEndDate ? utilDateTime.dayjsToLocalStringTemp(dayjs(date)) : undefined,
                serviceCalendarId: serviceCalendar.id,
                sumary
            }
            const res = await takeComboOrderService.uploadCalendar(body)

            onSubmit(res.data.previousCalendar, res.data.nextCalendar)
            dispatch(setNoti({type: 'success', message: 'Cập nhật lịch chăm sóc thành công'}))
            onClose()
        }catch(e){
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
        setLoading(false)
    }
    return (
        <Modal
            open
            title={`Cập nhật báo cáo cho ngày chăm sóc (${utilDateTime.dateToString(serviceCalendar.serviceDate.toString())})`}
            onCancel={onClose}
            footer={false}
            width={1000}
        >
            <Form
                labelAlign='left'
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
                            disabledDate={current => utilDateTime.disableDateCalendar(current, serviceCalendar.serviceDate, pkgOrder.serviceEndDate)}
                            onChange={handleChangeDateUpdateCalendar}
                            style={{width: 250}}
                            value={date}
                            disabled={dayjs(new Date()).valueOf() >= dayjs(pkgOrder.serviceEndDate).valueOf()}
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

export default UploadPackageCalendar