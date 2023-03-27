import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Switch } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import LandingFooter from 'app/components/footer/LandingFooter'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import LandingHeader from 'app/components/header/LandingHeader'
import ModalTakeCareCreateTree from 'app/components/modal/takecare-create-tree/ModalTakeCareCreateTree'
import useDispatch from 'app/hooks/use-dispatch'
import useSelector from 'app/hooks/use-selector'
import { ServiceCreate } from 'app/models/service'
import { UserTree } from 'app/models/user-tree'
import serviceService from 'app/services/service.service'
import userTreeService from 'app/services/user-tree.service'
import { setNoti } from 'app/slices/notification'
import pagingPath from 'app/utils/paging-path'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import { IoCreateOutline } from 'react-icons/io5'
import { MdMiscellaneousServices } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import './style.scss'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const schema = yup.object().shape({
    name: yup.string().required('Tên không được để trống').max(50, 'Tối đa 50 ký tự'),
    phone: yup.string().required('Số điện thoại không được để trống').matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
    email: yup.string().required('Email không được để trống').matches(mailRegex, 'Email không hợp lệ'),
    address: yup.string().required('Địa chỉ không được để trống').max(200, 'Tối đa 200 ký tự'),
})


const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

// 1 là create - 2 là update - 3 là tạo service
interface ModalProps{
    openModal: number;
    tree?: UserTree
}

const ClientTakeCareService: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [modalState, setModalState] = useState<ModalProps>({openModal: 0})

    const [listTrees, setListTrees] = useState<UserTree[]>([])
    const [treesSelect, setTreesSelect] = useState<UserTree[]>([])

    const [viewAll, setViewAll] = useState(false)

    const { formState: { errors, isSubmitting, isSubmitted }, handleSubmit, setValue, control, setError, clearErrors } = useForm<ServiceCreate>({
        resolver: yupResolver(schema)
    })

    const userState = useSelector(state => state.userInfor)

    useEffect(() =>{
        pagingPath.scrollTop()

        const init = async () =>{
            try{
                const res = await userTreeService.getUserTree()
                console.log(res)
                setListTrees(res.data)
            }catch{

            }
        }
        init()
    }, [])

    useEffect(() =>{
        const { fullName, phone, address, mail } = userState.user
        setValue('name', fullName)
        setValue('phone', phone)
        setValue('email', mail)
        setValue('address', address)
        setValue('rewardPointUsed', 0)
        setValue('isTransport', false)

    }, [setValue, userState])

    const handleCreateNewTree = () =>{
        setModalState({openModal: 1})
    }
    const handleCreateUpdateTree = (tree: UserTree, isCreate: boolean) =>{
        if(isCreate){
            setListTrees([tree, ...listTrees])
        }else{
            const index = listTrees.findIndex(x => x.id === tree.id)
            listTrees[index] = tree
            setListTrees([...listTrees])
        }
        setModalState({openModal: 0, tree: undefined})
    }

    const handleSelectTree = (tree: UserTree) =>{
        const index = treesSelect.findIndex(x => x.id === tree.id)

        if(index < 0){
            setTreesSelect([tree, ...treesSelect])
        }else{
            treesSelect.splice(index, 1)
            setTreesSelect([...treesSelect])
        }
    }
    const handleUpdateStatus = async (checked: boolean, item: UserTree) =>{
        try{
            const status = checked ? 'active' : 'disable'
            await userTreeService.updateUserTreeStatus(item.id, status)
            const index = listTrees.findIndex(x => x.id === item.id)
            listTrees[index].status = status
            setListTrees([...listTrees])
            dispatch(setNoti({type: 'success', message: 'Cập nhật trạng thái thành công'}))
        }catch{

        }
    }
    const handleCreateTakeCareService = () =>{
        if(treesSelect.length === 0){
            dispatch(setNoti({type: 'info', message: 'Chọn ít nhất 1 cây của bạn để tạo yêu cầu chăm sóc'}))
            return;
        }
        setModalState({openModal: 3})
    }
    const handleSubmitForm = async (data: ServiceCreate) =>{
        if(!data.startDate){
            setError('startDate', {
                message: 'Ngày chăm sóc không được để trống',
                type: 'pattern'
            })
            return;
        }
        
        try{
            const userTreeIDList = treesSelect.map(x => x.id)
            const body = {
                ...data,
                userTreeIDList
            }
            await serviceService.createServcieRequest(body)
            dispatch(setNoti({type: 'success', message: 'Đã gửi yêu cầu chăm sóc cây thành công'}))
            setModalState({openModal: 0})
            setTreesSelect([])
        }catch{

        }
    }
    const handleChangeDateRange = (dates, dateStrings) =>{
        if(!dates){
            setValue('startDate', undefined)
            setValue('endDate', undefined)
            if(isSubmitted){
                setError('startDate', {
                    message: 'Ngày chăm sóc không được để trống',
                    type: 'pattern'
                })
            }
            return;
        }
        const [start, end] = dates
        setValue('startDate', start.toDate())
        setValue('endDate', end.toDate())
        clearErrors('startDate')
    }
    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper ts-wrapper">
                    <HeaderInfor title='Dịch vụ chăm sóc cây cảnh' />
                    <section className="ts-box default-layout">
                        <button className="ts-btn-create btn btn-create" onClick={() => navigate('/take-care-service/me')}>
                            <MdMiscellaneousServices size={25} />
                            Quản lý dịch vụ của bạn
                        </button>
                        <button className="ts-btn-create btn btn-create" onClick={handleCreateNewTree}>
                            <AiOutlinePlusSquare size={25} />
                            Tạo mới cây của bạn
                        </button>
                    </section>
                    <section className="default-layout ts-create-service">
                        <div>
                            <button className='btn btn-create' onClick={handleCreateTakeCareService}>
                                <IoCreateOutline size={25} />
                                Tạo dịch vụ chăm sóc cây
                            </button>
                        </div>
                    </section>
                    <section className="ts-infor default-layout">
                        {
                            listTrees.length === 0 ?
                            <div className="empty-tree">
                                <h1>Hiện tại bạn chưa có cây nào. Hãy tạo mới 1 cây</h1>
                                <button className='btn btn-create' onClick={handleCreateNewTree}>Tạo mới</button>
                            </div> :
                            <>
                                {
                                    <div className="filtering">
                                        <Checkbox checked={viewAll} onChange={(e) => setViewAll(e.target.checked)} >Hiển thị các cây đã chọn</Checkbox>
                                    </div>
                                }
                                <Row gutter={[12, 12]}>
                                    {
                                        (viewAll ? treesSelect : listTrees).map((item, index) => (
                                            <Col key={index} span={6}>
                                                <div className="item-detail">
                                                    <img src={item.imgUrls[0]} alt="/" />
                                                    <div className="item-infor">
                                                        <h1>
                                                            {item.treeName}
                                                            <span>({item.quantity})</span>
                                                        </h1>
                                                        <p className='description'>
                                                            Mô tả 
                                                            <span>{item.description}</span>
                                                        </p>
                                                    </div>
                                                    <div className="item-action">
                                                        <div className="status">
                                                            <Switch checked={item.status === 'active'} onChange={(checked: boolean) => handleUpdateStatus(checked, item)} />
                                                        </div>
                                                        <div className="detail ">
                                                            <button className='btn btn-create' onClick={() => setModalState({openModal: 2, tree: item})}>Chi tiết cây</button>
                                                        </div>
                                                    </div>
                                                    <div className="select-tree">
                                                        <Checkbox onChange={() => handleSelectTree(item)} checked={treesSelect.findIndex(x => x.id === item.id) > -1} >Chọn cây để chăm sóc</Checkbox>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </>
                        }
                    </section>
                </div>
            </div>
            <LandingFooter />
            {
                (modalState.openModal === 1 || modalState.openModal === 2) && 
                <ModalTakeCareCreateTree 
                    tree={modalState.tree}
                    onClose={() => setModalState({openModal: 0, tree: undefined})}
                    onSubmit={handleCreateUpdateTree}
                />
            }
            {
                <Modal
                    open={modalState.openModal === 3}
                    title='Tạo yêu cầu chăm sóc cây'
                    footer={null}
                    onCancel={() => setModalState({openModal: 0, tree: undefined})}
                    width={1000}
                >
                    {
                        treesSelect.map((item, index) => (
                            <div key={index}>
                                {item.treeName}
                            </div>
                        ))
                    }
                    <Form
                        layout='vertical'
                        onFinish={handleSubmit(handleSubmitForm)}
                    >
                        <Row gutter={[12, 0]}>
                            <Col span={12}>
                                <Form.Item label='Tên' required>
                                    <Controller 
                                        control={control}
                                        name='name'
                                        render={({field}) => (<Input {...field} />)}
                                    />
                                    {errors.name && <ErrorMessage message={errors.name.message} />}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label='Email' required>
                                    <Controller 
                                        control={control}
                                        name='email'
                                        render={({field}) => (<Input {...field} />)}
                                    />
                                    {errors.email && <ErrorMessage message={errors.email.message} />}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label='Số điện thoại' required>
                                    <Controller 
                                        control={control}
                                        name='phone'
                                        render={({field}) => (<Input {...field} />)}
                                    />
                                    {errors.phone && <ErrorMessage message={errors.phone.message} />}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label='Địa chỉ' required>
                                    <Controller 
                                        control={control}
                                        name='address'
                                        render={({field}) => (<Input {...field} />)}
                                    />
                                    {errors.address && <ErrorMessage message={errors.address.message} />}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label='Chọn ngày chăm sóc' required>
                                    <DatePicker.RangePicker 
                                        locale={locale} 
                                        placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                                        format={dateFormatList}
                                        disabledDate={(current) => current && current.valueOf()  < Date.now()}
                                        onChange={handleChangeDateRange}
                                        style={{width: '100%'}}
                                    />
                                    {errors.startDate && <ErrorMessage message={errors.startDate.message} />}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={`Sử dụng điểm thưởng (Số điểm bạn đang có là ${userState.user.currentPoint})`} required>
                                    <Controller 
                                        control={control}
                                        name='rewardPointUsed'
                                        render={({field: { value }}) => (<Input type='number' min={0} value={value} onChange={(e) => {
                                            const data = Number(e.target.value || 0)
                                            setValue('rewardPointUsed', data)
                                        }} />)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label='Chọn nơi chăm sóc cây' required>
                                    <Controller 
                                        control={control}
                                        name='isTransport'
                                        render={({field: { value, onChange }}) => (
                                            <Select value={value} onChange={onChange} >
                                                <Select.Option value={true} >Chăm sóc tại cửa hàng</Select.Option>
                                                <Select.Option value={false} >Chăm sóc tại nhà</Select.Option>
                                            </Select>
                                        )}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} >
                                <div className='btn-form-wrapper'>
                                    <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={() => setModalState({openModal: 0, tree: undefined})}>Hủy bỏ</Button>
                                    <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large' onClick={() => console.log(errors)}>
                                        {/* {
                                            tree ? 'Cập nhật' : 'Tạo mới'
                                        } */}
                                        Cập nhật
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            }
        </div>
    )
}

export default ClientTakeCareService