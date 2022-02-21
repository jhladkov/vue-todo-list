const arr = [
    {
        name: 'Sergo',
        id: 12,
        sectionName: 'All',
        prior: 4,
        value: 'dsfdsf',
        type: 'img',
    },
    {
        name: 'Sergo',
        id: 12,
        sectionName: 'one',
        prior: 4,
        value: 'dsfdsf',
        type: 'audio',
    },
    {
        name: 'Sergo',
        id: 12,
        sectionName: 'two',
        prior: 4,
        value: 'dsfdsf',
        type: 'video',
    },
    {
        name: 'Sergo',
        id: 12,
        sectionName: 'two',
        prior: 4,
        value: 'dsfdsf',
        type: 'video',
    },
]

getters: {
    getSections(state) {
        return state.arr.map(item => item.sectionName) // remove duplicate
    }
    getArr(state) {
        return state.arr
    }
}