import LandingFooter from 'app/components/footer/LandingFooter';
import LandingHeader from 'app/components/header/LandingHeader';
import useDispatch from 'app/hooks/use-dispatch';
import useSelector from 'app/hooks/use-selector';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useEffect } from 'react';
import './style.scss';

const ClientOrder: React.FC = () =>{
    const { id } = useSelector(state => state.userInfor)
    const dispatch = useDispatch();

    useEffect(() =>{
        if(!id) return;

        const init = async () =>{
            try{

            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [id, dispatch])

    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper co-wrapper">
                    
                </div>
            </div>
            <LandingFooter />
        </div>
    );
}

export default ClientOrder;