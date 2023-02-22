import { Button, Form, Input } from 'antd';
import { setNoti } from 'app/slices/notification';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/message.tsx/ErrorMessage';
import useDispatch from '../../hooks/use-dispatch';
import authService from '../../services/auth.service';
import { setUser } from '../../slices/user-infor';
import { setTitle } from '../../slices/window-title';
import CONSTANT from '../../utils/constant';
import './style.scss';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [errorLogin, setErrorLogin] = useState('');
  const [submitting, setSubmitting] = useState(false);
 
  useEffect(() =>{
    dispatch(setTitle(`${CONSTANT.APP_NAME} | Login`))
  }, [dispatch])

  const handleLogin = async (values: any) =>{
    if(submitting) return;

    setSubmitting(true)

    try{
      const { username, password } = values
      const res = await authService.login(username, password)
      if(res.isSuccess){
        const roleName = authService.decodeToken(res.data.token).rolename
        dispatch(setUser({...res.data, role: roleName}))
        localStorage.setItem(CONSTANT.STORAGE.ACCESS_TOKEN, res.data.token)
        if(location.state && location.state['history']) return navigate(location.state['history'])
        navigate('/')
      }
      setErrorLogin('Username or Password are not correct')
    }catch(err){
      dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
    }
    setSubmitting(false)
  }

  const isLogged = useMemo(() =>{
    const accessToken = localStorage.getItem(CONSTANT.STORAGE.ACCESS_TOKEN)
    if(!accessToken) return false

    const jwtDecode = authService.decodeToken(accessToken)
    const dateNow = new Date();
    if(!jwtDecode.rolename || !jwtDecode.username || jwtDecode.exp * 1000 < dateNow.getTime()) return false

    return true
  }, [])

  return (
    <div>
      {
        isLogged ? <Navigate to='/' /> :
        <div className='sign-in-wrapper'>
            <h2>Sign up</h2>
            <div className="sign-up-box">
                <div className="left">
                  <Form
                    layout='vertical'
                    initialValues={{
                      username: '',
                      password: ''
                    }}
                    onFinish={handleLogin}
                  >
                    <Form.Item label='Username' name='username'>
                      <Input />
                    </Form.Item>
                    <Form.Item label='Password' name='password'>
                      <Input type='password' />
                    </Form.Item>
                    {errorLogin && <ErrorMessage message={errorLogin} />}
                    <Form.Item>
                        <label className='register-msg'>
                            You don't have account
                            <Link to='/register'>Create an account</Link>
                        </label>
                    </Form.Item>
                    <Form.Item className='btn-box'>
                      <Button loading={submitting} type='primary' htmlType='submit' className='btn-submit' size='large'>Login</Button>
                      <Button type='primary' htmlType='button' className='btn-back' size='large' onClick={() => navigate('/')}>
                        Back to store
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
                <div className="right">
                  <img src='/assets/signin-image.jpg' alt='/' />
                </div>
            </div>
            {/* <div className="sign-up-footer">
                <div className="left">

                </div>
                <div className="right">

                </div>
            </div> */}
        </div>
      }
    </div>
  )
}

export default Login