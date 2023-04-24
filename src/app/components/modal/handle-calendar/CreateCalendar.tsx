import { Button, DatePicker, DatePickerProps, Form, Modal } from 'antd'
import { ServiceOrderDetail } from 'app/models/service'
import React, { useEffect, useState } from 'react'
import locale from 'antd/es/date-picker/locale/vi_VN';
import CONSTANT from 'app/utils/constant';
import dayjs, { Dayjs } from 'dayjs'
import utilDateTime from 'app/utils/date-time';
import useDispatch from 'app/hooks/use-dispatch';
import { setNoti } from 'app/slices/notification';
import { ServiceCalendar } from 'app/models/service-calendar';
import serviceCalendar from 'app/services/service-calendar.service';

interface CreateCalendarProps{
    serviceOrderDetail: ServiceOrderDetail
    onClose: () => void;
    onSubmit: (serviceCalendar: ServiceCalendar) => void;
}

const CreateCalendar: React.FC<CreateCalendarProps> = ({ serviceOrderDetail, onClose, onSubmit }) => {
    const dispatch = useDispatch()
    
    const [date, setDate] = useState<Dayjs | null>(null)
    
    useEffect(() =>{
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() + 1) 
    }, [])

    const handleChangeDateRange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(date)
    };

    const handleCreateNewCalendar = async () =>{
        if(!date){
            return dispatch(setNoti({type: 'warning', message: ' Không được để trống ngày chăm sóc'}))
        }
        try{
            const res = await serviceCalendar.initialServiceCalendar({calendarInitial: {
                serviceDate: utilDateTime.dayjsToLocalString(date),
                serviceOrderId: serviceOrderDetail.id
            }})
            const { id, images, serviceDate, serviceOrderId, status, sumary } = res.data
            const sCalendar: ServiceCalendar = {
                id, images, serviceDate, serviceOrderId, status, sumary,
                nextServiceDate: serviceDate
            }
            onSubmit(sCalendar)
            dispatch(setNoti({type: 'success', message: 'Tạo mới ngày chăm sóc đầu tiên thành công'}))
            onClose()
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }

    return (
        <Modal
            open
            title={`Tạo mới 1 lịch chăm sóc cho đơn hàng "${serviceOrderDetail.orderCode}"`}
            onCancel={onClose}
            footer={false}
        >
            <Form
                layout='vertical'   
                onFinish={handleCreateNewCalendar}
            >
                <Form.Item label='Chọn ngày chăm sóc đầu tiên'>
                        {/* // chỉ enable khoảng ngày đc phép */}
                        <DatePicker
                            locale={locale} 
                            format={CONSTANT.DATE_FORMAT_LIST}
                            // disabledDate={(current) => current && current.valueOf()  < (Date.now()) && current.valueOf() > serviceOrder?.service.endDate.valueOf()}
                            onChange={handleChangeDateRange}
                            disabledDate={(current) => current && (current.valueOf() < dayjs(serviceOrderDetail.serviceStartDate).valueOf() 
                                || current.valueOf() > dayjs(utilDateTime.plusDate(serviceOrderDetail.serviceEndDate, 1)).valueOf())}
                            value={date}
                            style={{width: 250}}
                        />
                </Form.Item>
                <div className='btn-form-wrapper'>
                    <Button htmlType='button'  type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                    <Button htmlType='submit'  type='primary' className='btn-update' size='large'>
                        Tạo mới
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default CreateCalendar