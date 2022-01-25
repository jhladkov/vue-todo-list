import {deleteObject} from "firebase/storage";

export const useRemoveData = (value) => {
    if (value) {
        deleteObject(value).then(() => {
        }).catch((error) => {
            console.log(error)
        });
    }
}