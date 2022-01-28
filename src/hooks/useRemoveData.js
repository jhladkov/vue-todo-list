import {deleteObject} from "firebase/storage";

export const useRemoveData = (value) => {
    console.log(value)
    if (value) {
        deleteObject(value).then(() => {
        }).catch((error) => {
            console.log(error)
        });
    }
}