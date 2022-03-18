export const useObjectTodo = (section = '', priority = 1, type = 'todo', inputValue, imgUrl = '', typeData = '',name = '', id = 0) => {

    return {
        section,
        priority,
        type,
        value: inputValue,
        storageInfo: {
            name,
            type: typeData,
            url: imgUrl
        },
        id
    }
}

