import {getDatabase, ref, set} from "firebase/database";

export const useWriteData = (value) => {
    try {
        if (JSON.parse(localStorage.getItem('userData')).user.uid) {
            const db = getDatabase();
            set(ref(db, `${JSON.parse(localStorage.getItem('userData')).user.uid}/`), {
                data: value
            });
        } else {
            console.log('storage value = null')
        }
    }catch (err) {
        console.log(err)
    }

}