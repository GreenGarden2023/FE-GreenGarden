import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Input, Modal, Select } from 'antd';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
import useDispatch from 'app/hooks/use-dispatch';
import { Size, SizeHandle } from 'app/models/size';
import sizeService from 'app/services/size.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiFillCaretDown } from 'react-icons/ai';
import * as yup from 'yup';
import './style.scss';

const schema = yup.object().shape({
  sizeName: yup.string().required('Tên kích thước không được để trống').trim().max(30, 'Không được nhiều hơn 30 ký tự'),
})

interface ModalSizeProps{
  size?: Size
  open: boolean;
  onClose: () => void;
  onSubmit: (size: Size) => void
}

const ModalSize: React.FC<ModalSizeProps> = ({size, open, onClose, onSubmit}) => {
  const dispatch = useDispatch()
  const { setValue, handleSubmit, formState: { errors, isSubmitting }, control, reset } = useForm<SizeHandle>({
    defaultValues:{
      sizeType: true
    },
    resolver: yupResolver(schema)
  })

  useEffect(() =>{
    if(!size) return;

    const { id, sizeName, sizeType } = size

    setValue('id', id)
    setValue('sizeName', sizeName)
    setValue('sizeType', sizeType)
  }, [size, setValue, reset])

  const done = (size: Size) =>{
    onSubmit(size)
    reset()
    onClose()
    dispatch(setNoti({type: 'success', message: `${size.id ? 'Cập nhật' : 'Tạo mới'} kích thước thành công`}))
  }

  const handleSubmitForm = async (data: SizeHandle) =>{
    if(!data.id){
      try{
        const res = await sizeService.createSize(data)
        done(res.data)
      }catch{
        dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
      }
    }else{
      try{
        await sizeService.updateSize(data)
        done({
          id: data.id,
          sizeName: data.sizeName,
          sizeType: data.sizeType
        })
      }catch{
        dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
      }
    }
  }
  const handleCloseModal = () =>{
    if(isSubmitting) return
    reset()
    onClose()
  }

  return (
    <Modal
      className='modal-ms-wrapper'
      open={open}
      title={`${size?.id ? 'Cập nhật' : 'Tạo mới'} kích thước ${size ? ('"' + size.sizeName + '"') : ''}`}
      footer={null}
      onCancel={handleCloseModal}
    >
      <Form
        layout='vertical'
        onFinish={handleSubmit(handleSubmitForm)}
        className='modal-ms-form'
      >
        <Form.Item label='Tên kích thước' required >
          <Controller 
            control={control}
            name='sizeName'
            render={({ field }) => <Input {...field} />}
          />
          {errors.sizeName && <ErrorMessage message={errors.sizeName.message} />}
        </Form.Item>
        <Form.Item label='Loại kích thước' required >
          <Controller 
            control={control}
            name='sizeType'
            render={({ field }) => (
              <Select suffixIcon={<AiFillCaretDown />} {...field}>
                <Select.Option value={true}>Duy nhất</Select.Option>
                <Select.Option value={false}>Số lượng lớn</Select.Option>
              </Select>
            )}
          />
        </Form.Item>
        <Form.Item className='btn-form-wrapper' >
          <Button disabled={isSubmitting} htmlType='button' className='btn-cancel' size='large' onClick={handleCloseModal}>Hủy bỏ</Button>
          <Button loading={isSubmitting} htmlType='submit' type='primary' className='btn-update' size='large'>{size?.id ? 'Cập nhật' : 'Tạo mới'}</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalSize