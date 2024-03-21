import * as React from "react";

import UserForm                   from "./UserForm";
import { context as authContext } from "../../contexts/auth/store/context";
import * as types                 from "../../contexts/auth/store/types";
import TUser                      from "../../types/TUser";

const UserProfile = (): React.ReactElement => {

    const {state: authState, mDispatch: authDispatch} = React.useContext(authContext)

    return (
        <div className="grid tab-content">
            <div className="col">
                <UserForm
                    user={authState.user}
                    onUpdate={(user: TUser) => {

                        authDispatch({type: types.USER_UPDATED, payload: user});
                    }}
                />
            </div>
        </div>

    )
};

export default UserProfile;

