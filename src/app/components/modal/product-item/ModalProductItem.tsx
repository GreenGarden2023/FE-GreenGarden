import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Form, Image, Input, Modal, Row, Select } from 'antd';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
import useDispatch from 'app/hooks/use-dispatch';
import { ProductItemType } from 'app/models/general-type';
import { ProductItem } from 'app/models/product-item';
import productItemService from 'app/services/product-item.service';
import uploadService from 'app/services/upload.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiFillCaretDown, AiOutlineCloudUpload } from 'react-icons/ai';
import * as yup from 'yup';
import './style.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const schema = yup.object().shape({
    name: yup.string().required('Tên sản phẩm không được để trống').min(5, 'Tên sản phẩm phải lớn hơn 5 ký tự').max(100, 'Tên sản phẩm phải nhỏ hơn 100 ký tự'),
    description: yup.string().max(500, 'Mô tả phải ít hơn 500 ký tự'),
    type: yup.string().required('Loại sản phẩm không được để trống'),
    imageURL: yup.string().required('Hình đại diện sản phẩm không được để trống'),
})

interface ModalProductItemProps{
    productId: string;
    productItem?: ProductItem;
    onClose: () => void;
    onSubmit: (productItem: ProductItem) => void;
}

const ModalProductItem: React.FC<ModalProductItemProps> = ({productId, productItem, onClose, onSubmit}) => {
    const dispatch = useDispatch();

    const ref = useRef<HTMLInputElement>(null);

    const { setValue, getValues, control, handleSubmit, formState: { errors, isSubmitting },  trigger, reset } = useForm<Partial<ProductItem>>({
        resolver: yupResolver(schema)
    })

    useEffect(() =>{
        if(!productId) return;

        setValue('productId', productId)
    }, [productId, setValue])

    useEffect(() =>{
        if(!productItem) return;

        const { id, productId, content, description, imageURL, name, type, productItemDetail, rule, careGuide } = productItem
        setValue('id', id)
        setValue('productId', productId)
        setValue('content', content)
        setValue('description', description)
        setValue('imageURL', imageURL)
        trigger('imageURL')
        setValue('name', name)
        setValue('type', type)
        setValue('productItemDetail', productItemDetail)
        setValue('rule', rule || '')
        setValue('careGuide', careGuide)

    }, [productItem, setValue, trigger])

    const handleCloseModal = () =>{
        onClose()
    }
  
    const handleSubmitForm = async (data: Partial<ProductItem>) =>{
        if(!data.id){
            try{
                const res = await productItemService.createProductItem(data);
                handleCloseModal()
                const content = res.data
                content.imageURL = data.imageURL || ''
                content.productItemDetail = []
                onSubmit(content)
                reset()
                dispatch(setNoti({type: 'success', message: `Tạo mới thành công`}))
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }else{
            try{
                await productItemService.updateProductItem(data);
                onSubmit(data as ProductItem)
                handleCloseModal()
                reset()
                dispatch(setNoti({type: 'success', message: `Cập nhật thành công`}))
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
    }

    const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) =>{
        const files = e.target.files

        if(!files) return;

        const file = files[0]

        if(!CONSTANT.SUPPORT_FORMATS.includes(file.type) || file.size > CONSTANT.FILE_SIZE_ACCEPTED){
            // setValue('imageURL', '')
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.INVALID_FILE}))
            // setError('imageURL', {
            //     type: 'pattern',
            //     message: `Định dạng ảnh chỉ chấp nhận ${CONSTANT.SUPPORT_FORMATS.join(' - ')}`
            // })
            // trigger('imageURL')
            return;
        }

        try{
            const res = await uploadService.uploadListFiles([file])
            setValue('imageURL', res.data[0])
            trigger('imageURL')
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    // const editorConfiguration = {
    //     toolbar: [ 'bold', 'italic', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor']
    // };
    // const toolbarStyle = {
    //     position: 'fixed',
    //     top: 0,
    //     left: 0,
    //     right: 0
    //   };
    const NumberOfChild = useMemo(() =>{
        if(!productItem) return 0;

        return productItem.productItemDetail.length
    }, [productItem])
    return (
        <Modal
            className='modal-pi-wrapper'
            open
            onCancel={handleCloseModal}
            footer={null}
            title={`${productItem ? 'Chỉnh sửa' : 'Tạo mới'} sản phẩm`}
            width={1200}
            style={{overflow: 'hidden auto'}}
            bodyStyle={{maxHeight: '650px', overflow: 'hidden auto'}}
        >
            <Form
                layout='vertical'
                onFinish={handleSubmit(handleSubmitForm)}
                className='modal-pi-form'
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label='Tên sản phẩm' required>
                            <Controller 
                                control={control}
                                name='name'
                                render={({ field }) => <Input {...field} />}
                            />
                            {errors.name && <ErrorMessage message={errors.name.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Loại sản phẩm' required>
                            <Controller 
                                control={control}
                                name='type'
                                render={({ field: { value } }) => (
                                    <Select disabled={(NumberOfChild > 1 && productItem?.type === 'normal') || (NumberOfChild > 1 && productItem?.type === 'normal')} suffixIcon={<AiFillCaretDown />} onChange={(value: string) => {
                                        setValue('type', value as ProductItemType)
                                        trigger('type')
                                    }} value={value} >
                                        <Select.Option value='unique'>
                                            Duy nhất
                                        </Select.Option>
                                        <Select.Option value='normal'>
                                            Số lượng lớn
                                        </Select.Option>
                                    </Select>
                                )}
                            />
                            {errors.type && <ErrorMessage message={errors.type.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Mô tả'>
                            <Controller 
                                control={control}
                                name='description'
                                render={({ field }) => <Input.TextArea {...field} autoSize={{minRows: 4, maxRows: 4}} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Điều khoản khi thuê cây'>
                            <Controller 
                                control={control}
                                name='rule'
                                render={({ field }) => <Input.TextArea {...field} autoSize={{minRows: 4, maxRows: 4}} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='Hướng dẫn chăm sóc'>
                            <Controller 
                                control={control}
                                name='careGuide'
                                render={({ field }) => <Input.TextArea {...field} autoSize={{minRows: 4, maxRows: 6}} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{marginBottom: '20px'}}>
                        <button className='btn btn-upload' type='button' onClick={() => ref.current?.click()}>
                            <AiOutlineCloudUpload size={24} />
                            Chọn ảnh đại diện sản phẩm
                        </button>
                        {errors.imageURL && <ErrorMessage message={errors.imageURL.message} />}
                    </Col>
                    <input type="file" multiple hidden ref={ref} accept='.png,.jpg,.jpeg' onChange={handleUploadFiles} />
                    {
                        getValues('imageURL') && 
                       <Col  span={6} >
                            <Image 
                                src={getValues('imageURL')}
                                alt='/'
                            />
                        </Col>
                    }
                    <Col span={24} style={{marginTop: '20px'}}>
                        <Form.Item label='Thông tin sản phẩm'>
                            <Controller
                                control={control}
                                name={`content`}
                                render={({field: { value }}) => (
                                    <ReactQuill theme="snow" value={value} onChange={(val) => {
                                        setValue('content', val)
                                        trigger('content')
                                    }}
                                    style={{
                                        height: '400px'
                                    }}
                                    modules={{
                                        toolbar: {
                                          container: [
                                            [{ 'header': [1, 2, false] }],
                                            ['bold', 'italic', 'underline','strike', 'blockquote'],
                                            [{'color': ['#00a76f', '#707070']}, {'background': ['#00a76f', '#707070']}],          
                                            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                                            ['link', 'image'],
                                            [{'size': ['small', false, 'large', 'huge']}],        
                                            ['clean']
                                          ],
                                        },
                                    }}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{'marginTop': '30px'}}>
                        <Form.Item className='btn-form-wrapper'>
                            <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={handleCloseModal}>Hủy bỏ</Button>
                            <Button htmlType='submit'  loading={isSubmitting} type='primary' className='btn-update' size='large'>
                                {productItem ? 'Cập nhật' : 'Tạo mới'}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ModalProductItem