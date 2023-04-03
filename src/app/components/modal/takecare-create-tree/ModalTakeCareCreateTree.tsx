import { Button, Col, Form, Image, Input, Modal, Row } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { UserTree } from 'app/models/user-tree'
import uploadService from 'app/services/upload.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { CiSquareRemove } from 'react-icons/ci';
import './style.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
import userTreeService from 'app/services/user-tree.service';

const schema = yup.object().shape({
  treeName: yup.string().required('Tên của cây không được để trống').max(50, 'Tên của cây không nhiều hơn 50 ký tự'),
  description: yup.string().required('Mô tả không được để trống').max(500, 'Mô tả không nhiều hơn 500 ký tự'),
  imgUrls: yup.array().required('Có ít nhất 1 hình ảnh cho thông tin này').min(1, 'Có ít nhất 1 hình ảnh cho thông tin này'),
  quantity: yup.number().min(1, 'Số lượng cây ít nhất là 1')
})

interface ModalTakeCareCreateTreeProps{
  tree?: UserTree
  onClose: () => void;
  onSubmit: (tree: UserTree, isCreate: boolean) => void
}

const ModalTakeCareCreateTree:React.FC<ModalTakeCareCreateTreeProps> = ({ tree, onClose, onSubmit }) => {
  console.log({tree})
  const dispatch = useDispatch()
  const { setValue, formState: { errors, isSubmitting }, control, handleSubmit, setError, trigger, getValues } = useForm<Partial<UserTree>>({
    defaultValues: {
      status: 'active',
      quantity: 0,
    },
    resolver: yupResolver(schema)
  })
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() =>{
    if(!tree) return;

    const { id, treeName, quantity, description, imgUrls, status } = tree
    setValue('id', id)
    setValue('treeName', treeName)
    setValue('quantity', quantity)
    setValue('description', description)
    setValue('imgUrls', imgUrls)
    setValue('status', status)
    trigger('imgUrls')
  }, [tree, setValue, trigger])

  const handleSubmitForm = async (data: Partial<UserTree>) =>{
    if(!data) return;

    if((data.quantity || 0) > (data.imgUrls ? data.imgUrls.length : 0)){
      setError('imgUrls', {
        type: 'pattern',
        message: 'Số lượng ảnh không đủ so với số lượng cây'
      })
      return
    }
    
    if(!data.id){
      // create
      try{
        // const { status, ...rest } = data
        
        const res = await userTreeService.createUserTree(data)
        dispatch(setNoti({type: 'success', message: `Tạo mới cây của bạn thành công`}))
        onSubmit(res.data, true)
      }catch{

      }
    }else{
      // update
      try{
        const res = await userTreeService.updateUserTree(data)
        dispatch(setNoti({type: 'success', message: `Cập nhật cây của bạn thành công`}))
        onSubmit(res.data, false)
      }catch{

      }
    }
  }
  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) =>{
    const files = e.target.files
    if(!files) return;

    const finalFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if(!CONSTANT.SUPPORT_FORMATS.includes(file.type)){
            setError('imgUrls', {
                type: 'pattern',
                message: `Định dạng ảnh chỉ chấp nhận ${CONSTANT.SUPPORT_FORMATS.join(' - ')}`
            })
            trigger('imgUrls')
            return;
        }
        finalFiles.push(file)
    }
    try{
        const res = await uploadService.uploadListFiles(finalFiles)
        let finalValues = getValues('imgUrls') || []
        finalValues = [...finalValues, ...res.data]
        setValue('imgUrls', finalValues)
        trigger('imgUrls')
    }catch{
        dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
    }
  }
  const handleRemoveImage = (index: number) => {
    const finalValues = getValues('imgUrls') || []
    finalValues.splice(index, 1)
    setValue('imgUrls', finalValues)
    trigger('imgUrls')
  }
  const handleCloseModal = () =>{
    onClose()
  }

  return (
    <Modal
      open
      title={`${!tree ? 'Tạo mới' : 'Cập nhật'} cây của bạn`}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <Form
        layout='vertical'
        onFinish={handleSubmit(handleSubmitForm)}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label='Tên cây' required >
              <Controller
                control={control}
                name='treeName'
                render={({ field }) => (<Input {...field} />)}
              />
              {errors.treeName && <ErrorMessage message={errors.treeName.message} />}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Số lượng cây' required >
              <Controller
                control={control}
                name='quantity'
                render={({ field: { value } }) => (<Input type='number' min={0} value={value} onChange={(e) =>{
                  const data = Number(e.target.value || 0)
                  setValue('quantity', data)
                  trigger('quantity')
                }} />)}
              />
              {errors.quantity && <ErrorMessage message={errors.quantity.message} />}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='Mô tả' required>
                <Controller 
                    control={control}
                    name='description'
                    render={({ field }) => <Input.TextArea {...field} autoSize={{minRows: 4, maxRows: 6}} />}
                />
                {errors.description && <ErrorMessage message={errors.description.message} />}
            </Form.Item>
          </Col>
          <input type="file" hidden ref={ref} accept='.png,.jpg,.jpeg' multiple onChange={handleUploadFiles} />
          <Col span={24} style={{marginBottom: '20px'}}>
              <button className='btn btn-upload' type='button' onClick={() => ref.current?.click()}>
                  <AiOutlineCloudUpload size={24} />
                  Đăng tải hình ảnh
              </button>
              {errors.imgUrls && <ErrorMessage message={errors.imgUrls.message} />}
          </Col>
          {
            getValues('imgUrls') &&
            <Image.PreviewGroup>
                {
                    (getValues('imgUrls') || []).map((item, index) => (
                        <Col span={6} key={index} className='preview-wrapper'>
                            <Image 
                                src={item}
                                alt='/'
                                className='img-preview'
                            />
                            <CiSquareRemove size={30} onClick={() => handleRemoveImage(index)} className='btn-remove' />
                        </Col>
                    ))
                }
            </Image.PreviewGroup>
          }
          <Col span={24} >
            <div className='btn-form-wrapper'>
                <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={handleCloseModal}>Hủy bỏ</Button>
                <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large' onClick={() => console.log(errors)}>
                    {
                        tree ? 'Cập nhật' : 'Tạo mới'
                    }
                </Button>
            </div>
        </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalTakeCareCreateTree