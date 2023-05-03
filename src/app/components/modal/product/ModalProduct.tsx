import { Button, Col, Form, Input, Modal, Row, Switch, Upload, UploadProps } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
import { Action } from 'app/models/general-type';
import { Product, ProductHandle } from 'app/models/product';
import utilsFile from 'app/utils/file';
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { AiOutlinePlus } from 'react-icons/ai';
import './style.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CONSTANT from 'app/utils/constant';
import productServcie from 'app/services/product.service';
import useDispatch from 'app/hooks/use-dispatch';
import { setNoti } from 'app/slices/notification';

const schema = yup.object().shape({
    name: yup.string().required('Tên sản phẩm không được để trống').min(5, 'Tên sản phẩm có tối thiểu 5 ký').max(30, 'Tên sản phẩm có tối đa 30 ký tự'),
    description: yup.string().max(500, 'Mô tả có tối đa 500 ký tự'),
    imgUrl: yup.string().required('Ảnh bìa không được để trống'),
    imgFile: yup.mixed()
    .test('FILE_FORMAT', 'Ảnh bìa chỉ hỗ trợ các định dạng png/jpg/jpeg', (value) => {
        return !value || (value && CONSTANT.SUPPORT_FORMATS.includes(value.type))
    })
    .test('FILE_SIZE', 'Kích thước ảnh bìa quá lớn', (value ) => {
        return !value || (value && value.size <= 1000000)
    })
})

interface ModalProductProps{
    categoryId: string;
    product?: Product;
    action: Action;
    open: boolean;
    onClose: () => void;
    onSubmit: (product: Product, action: Action) => void;
}
const ModalProduct: React.FC<ModalProductProps> = ({ categoryId, product, action, open, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    const { setValue, control, handleSubmit, formState: { errors, isSubmitting }, reset, trigger,  } = useForm<ProductHandle>({
        defaultValues: {
            categoryId,
            isForRent: true,
            isForSale: true
        },
        resolver: yupResolver(schema)
    })
    
    useEffect(() =>{
        setValue('categoryId', categoryId)

        if(!product) return;
        const { id, name, description, imgUrl, status, isForRent, isForSale } = product
        setValue('id', id)
        setValue('name', name)
        setValue('description', description)
        setValue('imgUrl', imgUrl)
        setValue('status', status)
        setValue('isForRent', isForRent)
        setValue('isForSale', isForSale)

    }, [product, setValue, categoryId])

    const handleCloseModal = () =>{
        if(isSubmitting) return
        reset()
        onClose()
    }
    const handleSubmitForm = async (data: ProductHandle) =>{
        if(action === 'Create'){
            try{
                const res = await productServcie.createProduct(data)
                onSubmit(res.data, action)
                reset()
                onClose()
                dispatch(setNoti({type: 'success', message: `Tạo mới "${data.name}" thành công`}))
            }catch(err){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }else if(action === 'Update'){
            try{
                await productServcie.updateProduct(data)
                const { id, name, description, imgUrl, status, isForRent, isForSale } = data
                const p: Product = {
                    id: id || '',
                    name: name,
                    categoryId,
                    description: description,
                    imgUrl: imgUrl || '',
                    status: status || 'Active',
                    isForRent, isForSale
                }
                onSubmit(p, action)
                reset()
                onClose()
                dispatch(setNoti({type: 'success', message: `Cập nhật "${data.name}" thành công`}))
            }catch(err){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
    }
    const handleUpload: UploadProps['onChange']  = (info: UploadChangeParam<UploadFile>) =>{
        utilsFile.getBase64(info.file.originFileObj as RcFile, (url) => {
          setValue('imgFile', info.file.originFileObj)
          trigger('imgFile')
          setValue('imgUrl', url)
          trigger('imgUrl')
        })
    }
    return (
        <Modal
            className='mp-wrapper'
            open={open}
            footer={null}
            onCancel={handleCloseModal}
            title={`${action === 'Create' ? 'Tạo mới' : 'Cập nhật'} sản phẩm ${product ? `"${product.name}"` : ''}`}
            width={800}
        >
            <Form
                layout='vertical'
                onFinish={handleSubmit(handleSubmitForm)}
                className='form-infor-header'
            >
                <Form.Item label='Tên sản phẩm' required>
                    <Controller
                        control={control}
                        name='name'
                        render={({ field }) => <Input {...field} />}
                    />
                    {errors.name && <ErrorMessage message={errors.name.message} />}
                </Form.Item>
                <Form.Item label='Mô tả'>
                    <Controller
                        control={control}
                        name='description'
                        render={({ field }) => <Input.TextArea {...field} style={{ height: 120, resize: 'none' }} />}
                    />
                    {errors.description && <ErrorMessage message={errors.description.message} />}
                </Form.Item>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label='Cho bán'>
                            <Controller
                                control={control}
                                name='isForSale'
                                render={({ field: { value, onChange} }) => <Switch checked={value} onChange={onChange} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Cho thuê'>
                            <Controller
                                control={control}
                                name='isForRent'
                                render={({ field: { value, onChange} }) => <Switch checked={value} onChange={onChange} />}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label='Ảnh bìa' required>
                    <Controller
                        control={control}
                        name='imgUrl'
                        render={({ field: { value }}) => (
                            <>
                                <div>
                                    <Upload
                                        onChange={handleUpload}
                                        showUploadList={false}
                                        accept='.png,.jpg,.jpeg'
                                    >
                                        {
                                        value ? <img src={value} style={{width: '200px', cursor: 'pointer'}} alt='/'  /> : 
                                        <div className='form-upload-box'>
                                            <AiOutlinePlus />
                                            <span>Upload</span>
                                        </div>
                                        }
                                    </Upload>
                                </div>
                                {errors.imgFile && <ErrorMessage message={errors.imgFile.message} />}
                                {errors.imgUrl && <ErrorMessage message={errors.imgUrl.message} />}
                            </>
                        )}
                    />
                </Form.Item>
                <Form.Item className='btn-form-wrapper' >
                    <Button disabled={isSubmitting} type='default' htmlType='button' className='btn-cancel' size='large' onClick={handleCloseModal}>Hủy</Button>
                    <Button loading={isSubmitting} type='primary' htmlType='submit' className='btn-update' size='large'>{action === 'Create' ? 'Tạo mới' : 'Cập nhật'}</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalProduct