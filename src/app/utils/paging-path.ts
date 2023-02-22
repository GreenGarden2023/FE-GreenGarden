const isValidPaging = (currentPage: string | null) =>{
    if(!currentPage || isNaN(Number(currentPage)) || Number(currentPage) < 1){
        return false;
    }
    return true
}
const scrollTop = () =>{
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })
}

const pagingPath = {
    isValidPaging,
    scrollTop
}

export default pagingPath