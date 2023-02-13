import React, { useEffect, useState } from "react";
import { Avatar, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Skeleton } from "@mui/material";

export function ApiProfileIban() {
    const UrlIban = "https://api-ibans.pesanin.com";

    const [isLoaded, setIsLoaded] = useState(true);
    const [postsAvatar, setPostAvatarUser] = useState("");
    const [postsProfileName, setPostProfileName] = useState("");
    const [postsJobTitle, setPostJobTitle] = useState("");

    const MySwal = withReactContent(Swal);

    // TOKEN //
    const fetchData = () => {
        const bodyFormData = {
            email: "ibansyahdienx7@gmail.com",
            password: "asinan1969",
        };
        const requestOptionsToken = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(bodyFormData)
        };
        fetch(`${UrlIban}/v1/token/challange`, requestOptionsToken)
            .then(async responseToken => {
                setIsLoaded(false);
                const isJsonToken = responseToken.headers.get('content-type')?.includes('application/json');
                const dataToken = isJsonToken && await responseToken.json();

                // check for error responseToken
                if (!responseToken.ok) {
                    // get error message from body or default to responseToken status
                    const errorToken = (dataToken && dataToken.msg) || responseToken.status;
                    return Promise.reject(errorToken);
                }

                // AUTH USER BY ID //
                const bodyFormDataUser = {
                    email: dataToken.data.user.email,
                };
                const requestOptionsUser = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': dataToken.data.auth.token_type + ' ' + dataToken.data.auth.access_token
                    },
                    body: JSON.stringify(bodyFormDataUser)
                };
                fetch(`${UrlIban}/v1/auth/profile`, requestOptionsUser)
                    .then(async responseUser => {
                        setIsLoaded(false);
                        const isJsonUser = responseUser.headers.get('content-type')?.includes('application/json');
                        const dataUser = isJsonUser && await responseUser.json();

                        // check for error responseUser
                        if (!responseUser.ok) {
                            // get error message from body or default to responseUser status
                            const errorUser = (dataUser && dataUser.msg) || responseUser.status;
                            return Promise.reject(errorUser);
                        }

                        setPostAvatarUser(
                            <Avatar
                                src={dataUser.data.profile_photo_path}
                                alt={dataUser.data.name}
                                title={dataUser.data.name}
                                size="xl"
                                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                            />
                        );

                        setPostProfileName(
                            <Typography variant="h5" color="blue-gray" className="mb-1">
                                <div>{dataUser.data.name}</div>
                            </Typography>
                        );


                        // JOB TITLE //

                        const bodyFormDataJobTitle = {
                            user_id: dataToken.data.user.id,
                        };
                        const requestOptionsJobTitle = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': dataToken.data.auth.token_type + ' ' + dataToken.data.auth.access_token
                            },
                            body: JSON.stringify(bodyFormDataJobTitle)
                        };
                        fetch(`${UrlIban}/v1/profile/list`, requestOptionsJobTitle)
                            .then(async responseJobTitle => {
                                setIsLoaded(false);
                                const isJsonJobTitle = responseJobTitle.headers.get('content-type')?.includes('application/json');
                                const dataJobTitle = isJsonJobTitle && await responseJobTitle.json();

                                // check for error responseJobTitle
                                if (!responseJobTitle.ok) {
                                    // get error message from body or default to responseJobTitle status
                                    const errorJobTitle = (dataJobTitle && dataJobTitle.msg) || responseJobTitle.status;
                                    return Promise.reject(errorJobTitle);
                                }

                                setPostJobTitle(
                                    <Typography
                                        variant="small"
                                        className="font-normal text-blue-gray-600"
                                    >
                                        {dataJobTitle.data.job_title}
                                    </Typography>
                                );
                            })
                            .catch(errorJobTitle => {
                                console.error('There was an error!', errorJobTitle);
                                MySwal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    html: 'Something went wrong! ' + errorJobTitle,
                                })
                            });
                    })
                    .catch(errorUser => {
                        console.error('There was an error!', errorUser);
                        MySwal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            html: 'Something went wrong! ' + errorUser,
                        })
                    });
            })
            .catch(errorToken => {
                console.error('There was an error!', errorToken);
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    html: 'Something went wrong! ' + errorToken,
                })
            });
    }

    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(false);
            fetchData()
        }, 2000)
    }, [])

    const loadedAvatar =
        <Skeleton height={50} width={50} variant="circular" animation="pulse" className="w-max">
            <Avatar src={postsAvatar} className="rounded-lg shadow-lg shadow-blue-gray-500/40" />
        </Skeleton>;
    const loadedProfileName =
        <Skeleton height={20} width={200} animation="pulse" className="w-max">
            <Typography variant="h5" color="blue-gray" className="mb-1"><div>{postsProfileName}</div></Typography>
        </Skeleton>;
    const loadedJobTitle =
        <Skeleton height={20} width={200} className="w-max" animation="pulse">
            <Typography variant="small" className="font-normal text-blue-gray-600">{postsJobTitle}</Typography>
        </Skeleton>

    return (
        <>
            {isLoaded ? loadedAvatar : postsAvatar}
            <div>
                {isLoaded ? loadedProfileName : postsProfileName}
                {isLoaded ? loadedJobTitle : postsJobTitle}
            </div>
        </>
    );
}

export default ApiProfileIban;