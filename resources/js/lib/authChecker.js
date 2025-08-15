import axios from 'axios';

const fetchAuthUser = async (successCallback, failedCallback, finalCallback) => {
    try {
        const res = await axios.get(route('api_me'));
        successCallback(res);
    } catch (err) {
        console.error('No authenticated user found:', err);
        failedCallback(null);
    } finally {
        finalCallback()
    }
};


export {
    fetchAuthUser
}
