import { Button, Form, Input, Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { Action } from 'app/models/general-type';
import { Size, SizeHandle } from 'app/models/size';
import sizeService from 'app/services/size.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useEffect } from 'react'
import { useForm , Controller} from 'react-hook-form';
import './style.scss'

interface ModalSizeProps{
  size?: Size
  action: Action;
  open: boolean;
  onClose: () => void;
  onSubmit: (actionType: Action, size: Size) => void
}

const ModalSize: React.FC<ModalSizeProps> = ({size, action, open, onClose, onSubmit}) => {
  const dispatch = useDispatch()
  const { setValue, handleSubmit, formState: { isSubmitting }, control, reset } = useForm<SizeHandle>()

  useEffect(() =>{
    if(!size) return;

    const { id, sizeName } = size

    setValue('id', id)
    setValue('sizeName', sizeName)
  }, [size, setValue, action, reset])

  const done = (actionType: Action, size: Size) =>{
    onSubmit(actionType, size)
    reset()
    onClose()
    dispatch(setNoti({type: 'success', message: `${actionType} size success`}))
  }

  const handleSubmitForm = async (data: SizeHandle) =>{
    if(action === 'Create'){
      try{
        const res = await sizeService.createSize(data)
        done(action, res.data)
      }catch{
        dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
      }
    }else if(action === 'Update'){
      try{

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
      title={`${action} size ${size ? (' ' + size.sizeName) : ''}`}
      footer={null}
      onCancel={handleCloseModal}
    >
      <Form
        layout='vertical'
        onFinish={handleSubmit(handleSubmitForm)}
        className='modal-ms-form'
      >
        <Form.Item label='Size name' required >
          <Controller 
            control={control}
            name='sizeName'
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item className='btn-form-wrapper' >
          <Button disabled={isSubmitting} htmlType='button' className='btn-cancel' size='large' onClick={handleCloseModal}>Cancel</Button>
          <Button loading={isSubmitting} htmlType='submit' type='primary' className='btn-update' size='large'>{action}</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalSize