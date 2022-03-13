import {getDatabase, ref, set} from "firebase/database";

export const useWriteData = (path = '',content) => {
    console.log(content)
    try {
        if (JSON.parse(localStorage.getItem('userData')).user.uid) {
            const db = getDatabase();
            set(ref(db, `${JSON.parse(localStorage.getItem('userData')).user.uid}/${path}`), {
               ...content
            });
        } else {
            console.log('storage value = null')
        }
    }catch (err) {
        console.log(err)
    }

}