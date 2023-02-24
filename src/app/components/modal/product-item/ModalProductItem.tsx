import { Button, Col, Form, Image, Input, Modal, Row, Select, Switch, Upload, UploadProps } from 'antd';
import { Action } from 'app/models/general-type';
import { ProductItem, ProductItemHandle } from 'app/models/product-item';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './style.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {InputNumber} from 'antd';
import { BiDollar } from 'react-icons/bi';
import { AiFillCaretDown, AiOutlineCloseCircle, AiOutlineCloudUpload } from 'react-icons/ai';
import { Size } from 'app/models/size';
import useDispatch from 'app/hooks/use-dispatch';
import sizeService from 'app/services/size.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import utilsFile from 'app/utils/file';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const schema = yup.object().shape({
    name: yup.string().required('Product name is required').min(5, 'Product name is greater than 5 characters').max(30, 'Product name is less than 30 characters'),
    salePrice: yup.number().required('Sale price is required').positive('Sale price must be positive number').max(1000000000, 'Sale price is less than 1.000.000.000 VNĐ'),
    description: yup.string().max(200, 'Description is less than 200 characters'),
    sizeId: yup.string().required('Size is required'),
    quantity: yup.number().positive('Quantity is positive number').max(1000000, 'Quantity is less than 1000000'),
    type: yup.string().required('Type is required'),
    rentPrice: yup.number().positive('Rent price is positive number').max(1000000000, 'Sale price is less than 1.000.000.000 VNĐ'),
    

    // imgFile: yup.mixed()
    // .test('FILE_FORMAT', 'We only support png/jpg/jpeg', (value) => {
    //     return !value || (value && CONSTANT.SUPPORT_FORMATS.includes(value.type))
    // })
    // .test('FILE_SIZE', 'The file is too large', (value ) => {
    //     return !value || (value && value.size <= 100000)
    // })
})

interface ModalProductItemProps{
    productIdSelected: string;
    productItem?: ProductItem;
    action: Action;
    open: boolean;
    onClose: () => void;
    // onSubmit: (product: Product, action: Action) => void;
}

const ModalProductItem: React.FC<ModalProductItemProps> = ({productIdSelected, productItem, action, open, onClose}) => {
    const dispatch = useDispatch();
    const [sizes, setSizes] = useState<Size[]>([])

    const { setValue, getValues, control, handleSubmit, formState: { errors,  },  trigger, setError } = useForm<ProductItemHandle>({
        defaultValues: {
            status: ''
        },
        resolver: yupResolver(schema)
    })

    useEffect(() =>{
        setValue('productId', productIdSelected)

        if(!productItem) return;
        const { id, name, description, content, imgURLs, productId, quantity, rentPrice, salePrice, size, status, type } = productItem
        setValue('id', id)
        setValue('name', name)
        setValue('description', description)
        setValue('content', content)
        setValue('imgURLs', imgURLs)
        setValue('productId', productId)
        setValue('quantity', quantity)
        setValue('rentPrice', rentPrice)
        setValue('salePrice', salePrice)
        setValue('sizeId', size.id)
        setValue('status', status)
        setValue('type', type)

    }, [productItem, setValue, productIdSelected])

    useEffect(() =>{
        const init = async () =>{
            try{
                const resSize = await sizeService.getAllSize();
                setSizes(resSize.data)
            }catch(err){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
            }
        }
        init()
    }, [action, dispatch])

    const handleCloseModal = () =>{
        onClose()
    }
    
    const isValidLarge = (files: RcFile[] | UploadFile[]) =>{
        const newFiles = files.map(x => x as RcFile)
        let errorMsg = ''
        for (let i = 0; i < newFiles.length; i++) {
            const file = newFiles[i];
            if(!CONSTANT.SUPPORT_FORMATS.includes(file.type)){
                errorMsg += `Image ${i + 1} is not valid file\n\r`
            }else if(file.size <= 100000){
                errorMsg += `Image ${i + 1} is too large\n\r`
            }
        }
        if(errorMsg){
            setError('imgURLs', {
                type: 'pattern',
                message: errorMsg
            })
            return false
        }
        return true
    }

    const handleSubmitForm = async (data: ProductItemHandle) =>{
        const files = data.imgFiles || []
        if(!files || files.length === 0){
            setError('imgURLs', {
                type: 'pattern',
                message: 'Image is required'
            })
            return
        }

        if(files.length > 6){
            setError('imgURLs', {
                type: 'pattern',
                message: 'Image count is less than 7 items'
            })
            return  
        }

        if(!isValidLarge(files)) return;
        
    }
    const [uploaded, setUploaded] = useState<UploadFile[]>([])
    const handleUpload: UploadProps['onChange']  = async (info: UploadChangeParam<UploadFile>) =>{
        const listPreview: string[] = []
        const listFile: RcFile[] = []
        console.log(info)
        // console.log(info.fileList)
        // console.log()
        setUploaded([...info.fileList])

        // const fileInForm = getValues('imgFiles') || []
        
        // const newInfof = info.fileList.filter((x, index) => {
        //     if((index + 1) > uploaded) return x
        // })
        // console.log(info.fileList.length)
        // setUploaded(info.fileList.length)
        // console.log(newInfof)



        
        for (let i = 0; i < info.fileList.length; i++) {
            const originFileObj = info.fileList[i].originFileObj as RcFile;
            utilsFile.getBase64(originFileObj, (url) =>{
                listPreview.push(url)
                setValue('imgURLs', [...listPreview])
            })
            listFile.push(originFileObj)
        }
        await trigger('imgURLs')
        setValue('imgFiles', listFile)
        // clearErrors('imgURLs')
    }
    const handleRemoveItem = async (index: number) =>{
        let newFileList = [...uploaded];
        newFileList.splice(index, 1)
        setUploaded([...newFileList])
        

        const urls = getValues('imgURLs')
        const files = getValues('imgFiles')

        urls?.splice(index, 1)
        files?.splice(index, 1)

        setValue('imgURLs', urls)
        setValue('imgFiles', files)
        await trigger('imgURLs')
        isValidLarge(newFileList)
    }
    return (
        <Modal
            className='modal-pi-wrapper'
            open={open}
            onCancel={handleCloseModal}
            footer={null}
            title={`${action} product item ${productItem ? (' ' + productItem.name) : ''}`}
            width={800}
        >
            <Form
                layout='vertical'
                onFinish={handleSubmit(handleSubmitForm)}
                className='modal-pi-form'
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label='Item name' required>
                            <Controller 
                                control={control}
                                name='name'
                                render={({ field }) => <Input {...field} />}
                            />
                        </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                        <Form.Item label='Sale Price' required>
                            <Controller 
                                control={control}
                                name='salePrice'
                                render={({ field }) => <InputNumber type={'number'} addonAfter={<BiDollar />} {...field} style={{width: '100%'}} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Rent Price' required>
                            <Controller 
                                control={control}
                                name='rentPrice'
                                render={({ field }) => <InputNumber type={'number'} addonAfter={<BiDollar />} {...field} style={{width: '100%'}} />}
                            />
                        </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                        <Form.Item label='Type' required>
                            <Controller 
                                control={control}
                                name='type'
                                render={({ field: { value, onChange} }) => (
                                    <Select suffixIcon={<AiFillCaretDown />} onChange={(value: string) => {
                                        setValue('type', value)
                                        trigger('type')
                                    }} value={value} >
                                        <Select.Option value='normal'>
                                            Normal
                                        </Select.Option>
                                        <Select.Option value='unique'>
                                            Unique
                                        </Select.Option>
                                    </Select>
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Quantity'>
                            <Controller 
                                control={control}
                                name='quantity'
                                render={({ field: { value, onChange } }) => (
                                    <InputNumber 
                                        onChange={onChange} 
                                        value={getValues('type') === 'unique' ? '' : value} 
                                        disabled={getValues('type') === 'unique'} 
                                        type={'number'} 
                                        style={{width: '100%'}} 
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Size'>
                            <Controller 
                                control={control}
                                name='sizeId'
                                render={({ field }) => (
                                    <Select suffixIcon={<AiFillCaretDown />} {...field} >
                                        {
                                            sizes.map((size, index) => (
                                                <Select.Option key={index} value={size.id}>
                                                    {size.sizeName}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Status'>
                            <Controller 
                                control={control}
                                name='status'
                                render={({ field: {value} }) => <Switch checked={value === 'Active'} onChange={(checked: boolean) => {
                                    setValue('status', checked ? 'Active' : 'Disable')
                                }} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='Description'>
                            <Controller 
                                control={control}
                                name='description'
                                render={({ field }) => <Input.TextArea {...field} style={{height: 120}} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='Images' required>
                            <Upload
                                onChange={handleUpload}
                                showUploadList={false}
                                accept='.png,.jpg,.jpeg'
                                multiple
                                className='modal-pi-uploader'
                                fileList={uploaded}
                                // onRemove={}
                            >
                                    <button type='button'>
                                        <AiOutlineCloudUpload size={24} />
                                        Upload images
                                    </button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    {
                        getValues('imgURLs')?.length !== 0 &&
                        <>
                            <Col span={24} className='preview-wrapper'>
                                <Image.PreviewGroup>
                                    <Row gutter={[12, 12]}>
                                        {
                                            getValues('imgURLs')?.map((x, index) => (
                                                <Col span={6} className='preview-item' key={index}>
                                                    <Image
                                                        key={index}
                                                        // width={190}
                                                        src={x}
                                                        className='preview-image'
                                                    />
                                                    <AiOutlineCloseCircle className='btn-close' size={25} color='#fff' onClick={() => handleRemoveItem(index)} />
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                </Image.PreviewGroup>
                            </Col>
                            {
                                errors.imgURLs && 
                                <Col span={24}>
                                    <ErrorMessage message={errors.imgURLs.message} />
                                </Col>
                            }
                        </>
                    }
                    <Col span={24}>
                        <Form.Item label='Content'>
                            {/* <Controller
                                control={control}
                                name='content'
                                render={({field}) => (
                                    <CKEditor
                                    
                                    ></CKEditor>
                                )}
                            /> */}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item>
                            <Button htmlType='button'>Cancel</Button>
                            <Button htmlType='submit'>Create</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ModalProductItem