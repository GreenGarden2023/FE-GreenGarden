import { Button, DatePicker, DatePickerProps, Form, Modal } from 'antd';
import { PackageOrder } from 'app/models/package'
import React, { useEffect, useState } from 'react'
import locale from 'antd/es/date-picker/locale/vi_VN';
import CONSTANT from 'app/utils/constant';
import dayjs, { Dayjs } from 'dayjs'
import utilDateTime from 'app/utils/date-time';
import useDispatch from 'app/hooks/use-dispatch';
import { setNoti } from 'app/slices/notification';
import { CalendarInitial, ServiceCalendar } from 'app/models/service-calendar';
import takeComboOrderService from 'app/services/take-combo-order.service';

interface CreatePackageCalendarProps{
    pkgOrder: PackageOrder
    onClose: () => void;
    onSubmit: (serviceCalendar: ServiceCalendar) => void;
}

const CreatePackageCalendar: React.FC<CreatePackageCalendarProps> = ({ pkgOrder, onClose, onSubmit }) => {
    const dispatch = useDispatch()

    const [date, setDate] = useState<Dayjs | null>(null)

    const [loadingAction, setLoadingAction] = useState(false)

    useEffect(() =>{
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() + 1) 
    }, [])

    const handleChangeDateRange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(date)
    };

    const handleSubmit = async () =>{
        if(!date){
            return dispatch(setNoti({type: 'warning', message: ' Không được để trống ngày chăm sóc'}))
        }
        setLoadingAction(true)
        try{
            const data: CalendarInitial = {
                serviceOrderId: pkgOrder.id,
                serviceDate: utilDateTime.dayjsToLocalStringTemp(dayjs(date))
            }
            const res = await takeComboOrderService.createFirstCalendar(data)
            if(res.isSuccess){
                onSubmit(res.data)
                dispatch(setNoti({type: 'success', message: 'Tạo mới ngày chăm sóc đầu tiên thành công'}))
                onClose()
            }
        }catch{

        }
        setLoadingAction(false)
    }

    return (
        <Modal
            open
            title={`Tạo mới 1 lịch chăm sóc cho đơn hàng (${pkgOrder.orderCode})`}
            onCancel={onClose}
            footer={false}
            width={800}
        >
            <Form
                labelAlign='left'
                layout='vertical'   
                onFinish={handleSubmit}
            >
                <Form.Item label='Chọn ngày chăm sóc đầu tiên'>
                    <DatePicker
                        locale={locale} 
                        format={CONSTANT.DATE_FORMAT_LIST}
                        // disabledDate={(current) => current && current.valueOf()  < (Date.now()) && current.valueOf() > serviceOrder?.service.endDate.valueOf()}
                        onChange={handleChangeDateRange}
                        disabledDate={(current) => current && (current.valueOf() < dayjs(pkgOrder.serviceStartDate).valueOf() 
                            || current.valueOf() > dayjs(utilDateTime.plusDate(pkgOrder.serviceEndDate, 1)).valueOf())}
                        value={date}
                        style={{width: 250}}
                    />
                </Form.Item>
                <div className='btn-form-wrapper'>
                    <Button htmlType='button' disabled={loadingAction} type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                    <Button htmlType='submit' loading={loadingAction} type='primary' className='btn-update' size='large'>
                        Tạo mới
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default CreatePackageCalendar