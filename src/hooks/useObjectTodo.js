export const useObjectTodo = (section = '',type= 'todo', inputValue, imgUrl = '' ,typeData= '',id= 0) => {

    return {
        section,
        type,
        value:inputValue,
        storageInfo: {
            type: typeData,
            url: imgUrl
        },
        id
    }
}

