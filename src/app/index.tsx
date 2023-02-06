import React from 'react';
import Routers from './routers';
import { BrowserRouter } from 'react-router-dom'

const App: React.FC = () =>{
    return (
        <BrowserRouter >
            <Routers />
        </BrowserRouter>
    );
}

export default App;