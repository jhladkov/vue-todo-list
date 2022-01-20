export const useObjectTodo = (section = '',type= 'todo', inputValue, imgUrl = '' ,id= 0) => {

    return {
        section,
        type,
        value:inputValue,
        imgUrl,
        id
    }
}

