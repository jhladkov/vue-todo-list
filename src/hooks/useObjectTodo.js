export const useObjectTodo = (section = '', priority = 1, type = 'todo', inputValue, imgUrl = '', typeData = '', id = 0) => {

    return {
        section,
        priority,
        type,
        value: inputValue,
        storageInfo: {
            type: typeData,
            url: imgUrl
        },
        id
    }
}

