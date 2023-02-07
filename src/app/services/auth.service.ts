import golbalAxios from "../utils/http-client"

const register = async () =>{
    const result = await golbalAxios.post('/register');
    return result
}
const login = async (username: string, password: string) =>{
    const result = await golbalAxios.post('/login');
    return result
}
const authService = {
    register,
    login
}

export default authService