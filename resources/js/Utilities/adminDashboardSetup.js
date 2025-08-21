import axios from 'axios';

const setUpAuthenticatedUse = ({ setAuthUser, setIsLoadingAuth, setCurrentAdmin }) => {
    const successCallback = (resp) => setAuthUser(resp.data.user);
    const failedCallback = () => setAuthUser(null);
    const finalCallback = () => setIsLoadingAuth(false);

    const fetchAuthUser = async (successCallback, failedCallback, finalCallback) => {
        try {
            const res = await axios.get(route('api_me'));
            let dateProp = res.data.user.created_at;
            dateProp = new Date(dateProp).toLocaleString('en-US', {
                month: 'short',
                year: 'numeric',
            });

            res.data.user.joinDate = dateProp;
            res.data.user.lastLogin = dateProp;

            successCallback(res);
            setCurrentAdmin(res.data.user);
        } catch (err) {
            console.error('No authenticated user found:', err);
            failedCallback();
        } finally {
            finalCallback();
        }
    };

    fetchAuthUser(successCallback, failedCallback, finalCallback)
};

export { setUpAuthenticatedUse };
